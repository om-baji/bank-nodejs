import { prisma } from '@bank/database'
import { kafkaService } from '@bank/kafka'
import { Prisma } from '@prisma/client'

export class CardService {
  private generateCardNumber(): string {
    return '4' + Math.random().toString().slice(2, 16).padStart(15, '0')
  }

  private generateCVV(): string {
    return Math.floor(100 + Math.random() * 900).toString()
  }

  async createCard(data: Omit<Prisma.CardCreateInput, 'cardNumber' | 'cvv'>) {
    const cardNumber = this.generateCardNumber()
    const cvv = this.generateCVV()
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 4)

    const card = await prisma.card.create({
      data: {
        ...data,
        cardNumber,
        cvv,
        expiryMonth: expiryDate.getMonth() + 1,
        expiryYear: expiryDate.getFullYear()
      },
      include: {
        user: true,
        account: true
      }
    })

    await kafkaService.publishMessage('card.created', {
      cardId: card.id,
      cardNumber: card.cardNumber.slice(-4),
      userId: card.userId,
      accountId: card.accountId,
      cardType: card.cardType,
      timestamp: new Date()
    })

    return {
      ...card,
      cardNumber: card.cardNumber.slice(-4),
      cvv: '***'
    }
  }

  async getCardById(id: string) {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        user: true,
        account: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (card) {
      return {
        ...card,
        cardNumber: card.cardNumber.slice(-4),
        cvv: '***'
      }
    }

    return null
  }

  async getUserCards(userId: string) {
    const cards = await prisma.card.findMany({
      where: { userId },
      include: {
        account: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    return cards.map(card => ({
      ...card,
      cardNumber: card.cardNumber.slice(-4),
      cvv: '***'
    }))
  }

  async blockCard(cardId: string) {
    const card = await prisma.card.update({
      where: { id: cardId },
      data: { isActive: false },
      include: { user: true, account: true }
    })

    await kafkaService.publishMessage('card.blocked', {
      cardId,
      userId: card.userId,
      accountId: card.accountId,
      timestamp: new Date()
    })

    return {
      ...card,
      cardNumber: card.cardNumber.slice(-4),
      cvv: '***'
    }
  }

  async updateLimits(cardId: string, dailyLimit?: number, monthlyLimit?: number) {
    const updateData: any = {}
    if (dailyLimit) updateData.dailyLimit = dailyLimit
    if (monthlyLimit) updateData.monthlyLimit = monthlyLimit

    const card = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
      include: { user: true, account: true }
    })

    await kafkaService.publishMessage('card.limits.updated', {
      cardId,
      dailyLimit: card.dailyLimit,
      monthlyLimit: card.monthlyLimit,
      timestamp: new Date()
    })

    return {
      ...card,
      cardNumber: card.cardNumber.slice(-4),
      cvv: '***'
    }
  }

  async processTransaction(cardId: string, amount: number, merchantName: string, type: string = 'PURCHASE') {
    return await prisma.$transaction(async (tx) => {
      const card = await tx.card.findUnique({
        where: { id: cardId },
        include: { account: true }
      })

      if (!card || !card.isActive) {
        throw new Error('Card not found or inactive')
      }

      if (card.account.balance.lt(amount)) {
        throw new Error('Insufficient balance')
      }

      const dailySpent = await tx.transaction.aggregate({
        where: {
          cardId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        _sum: { amount: true }
      })

      if (dailySpent._sum.amount && dailySpent._sum.amount.add(amount).gt(card.dailyLimit)) {
        throw new Error('Daily limit exceeded')
      }

      const newBalance = card.account.balance.sub(amount)

      await tx.account.update({
        where: { id: card.accountId },
        data: { balance: newBalance }
      })

      const reference = `TXN${Date.now()}`

      const transaction = await tx.transaction.create({
        data: {
          type,
          amount,
          description: `${type} at ${merchantName}`,
          status: 'COMPLETED',
          reference,
          cardId,
          accountId: card.accountId
        }
      })

      await kafkaService.publishMessage('card.transaction.completed', {
        transactionId: transaction.id,
        cardId,
        accountId: card.accountId,
        amount,
        merchantName,
        type,
        reference,
        timestamp: new Date()
      })

      return transaction
    })
  }
}