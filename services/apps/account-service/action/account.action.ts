import { prisma } from '@bank/database'
import { kafkaService } from '@bank/kafka'
import { Prisma } from '@prisma/client'
import { hashMaker } from '../../auth-service/hash_generator'

export class AccountService {
  private generateAccountNumber(): string {
    return Math.random().toString().slice(2, 12).padStart(10, '0')
  }

  async createAccount(data: Prisma.AccountCreateInput) {
    const accountNumber = this.generateAccountNumber()
    
    const account = await prisma.account.create({
      data: {
        ...data,
        accountNumber
      },
      include: {
        user: true,
        manager: true
      }
    })

    await kafkaService.publishMessage('account.created', {
      accountId: account.id,
      accountNumber: account.accountNumber,
      userId: account.userId,
      accountType: account.accountType,
      timestamp: new Date()
    })

    return account
  }

  async getAccountById(id: string) {
    return prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
        manager: true,
        cards: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })
  }

  async getAccountByNumber(accountNumber: string) {
    return prisma.account.findUnique({
      where: { accountNumber },
      include: {
        user: true,
        manager: true,
        cards: true
      }
    })
  }

  async getUserAccounts(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      include: {
        cards: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })
  }

  async updateBalance(accountId: string, amount: number, type: 'DEBIT' | 'CREDIT') {
    const account = await prisma.account.findUnique({ where: { id: accountId } })
    if (!account) throw new Error('Account not found')

    const newBalance = type === 'CREDIT' 
      ? account.balance.add(amount)
      : account.balance.sub(amount)

    if (newBalance.lt(0)) {
      throw new Error('Insufficient balance')
    }

    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
      include: { user: true }
    })

    await kafkaService.publishMessage('account.balance.updated', {
      accountId,
      oldBalance: account.balance,
      newBalance,
      amount,
      type,
      timestamp: new Date()
    })

    return updatedAccount
  }

  async transfer(fromAccountId: string, toAccountId: string, amount: number, description?: string) {
    return await prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findUnique({ where: { id: fromAccountId } })
      const toAccount = await tx.account.findUnique({ where: { id: toAccountId } })

      if (!fromAccount || !toAccount) {
        throw new Error('Account not found')
      }

      if (fromAccount.balance.lt(amount)) {
        throw new Error('Insufficient balance')
      }

      const newFromBalance = fromAccount.balance.sub(amount)
      const newToBalance = toAccount.balance.add(amount)

      await tx.account.update({
        where: { id: fromAccountId },
        data: { balance: newFromBalance }
      })

      await tx.account.update({
        where: { id: toAccountId },
        data: { balance: newToBalance }
      })

      const reference = `TXN${Date.now()}`

      const inputs = fromAccount.accountNumber + toAccount.accountNumber; 

      const id = hashMaker(inputs) 

      const transaction = await tx.transaction.create({
        data: {
          id: id,  
          type: 'TRANSFER',
          amount,
          description: description || 'Account transfer',
          status: 'COMPLETED',
          reference,
          fromAccount: fromAccount.accountNumber,
          toAccount: toAccount.accountNumber
        }
      })

      await kafkaService.publishMessage('transfer.completed', {
        transactionId: transaction.id,
        fromAccountId,
        toAccountId,
        amount,
        reference,
        timestamp: new Date()
      })

      return transaction
    })
  }

  async freezeAccount(accountId: string) {
    const account = await prisma.account.update({
      where: { id: accountId },
      data: { isActive: false },
      include: { user: true }
    })

    await kafkaService.publishMessage('account.frozen', {
      accountId,
      userId: account.userId,
      timestamp: new Date()
    })

    return account
  }

  async getAccountStatement(accountId: string, startDate: Date, endDate: Date) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        user: true,
        transactions: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!account) throw new Error('Account not found')

    await kafkaService.publishMessage('statement.generated', {
      accountId,
      userId: account.userId,
      startDate,
      endDate,
      transactionCount: account.transactions.length,
      timestamp: new Date()
    })

    return account
  }
}