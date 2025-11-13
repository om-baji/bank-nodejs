import { prisma } from '@bank/database'
import { kafkaService } from '@bank/kafka'
import { Prisma } from '@prisma/client'

export class ManagerService {
  async createManager(data: Prisma.ManagerCreateInput) {
    const manager = await prisma.manager.create({
      data,
      include: {
        user: true,
        accounts: {
          include: {
            user: true
          }
        }
      }
    })

    await kafkaService.publishMessage('manager.created', {
      managerId: manager.id,
      employeeId: manager.employeeId,
      userId: manager.userId,
      department: manager.department,
      timestamp: new Date()
    })

    return manager
  }

  async getManagerById(id: string) {
    return prisma.manager.findUnique({
      where: { id },
      include: {
        user: true,
        accounts: {
          include: {
            user: true,
            cards: true,
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        }
      }
    })
  }

  async getManagerByEmployeeId(employeeId: string) {
    return prisma.manager.findUnique({
      where: { employeeId },
      include: {
        user: true,
        accounts: {
          include: {
            user: true
          }
        }
      }
    })
  }

  async assignAccountToManager(managerId: string, accountId: string) {
    const account = await prisma.account.update({
      where: { id: accountId },
      data: { managerId },
      include: {
        user: true,
        manager: {
          include: { user: true }
        }
      }
    })

    await kafkaService.publishMessage('account.manager.assigned', {
      accountId,
      managerId,
      userId: account.userId,
      timestamp: new Date()
    })

    return account
  }

  async removeAccountFromManager(accountId: string) {
    const account = await prisma.account.update({
      where: { id: accountId },
      data: { managerId: null },
      include: {
        user: true
      }
    })

    await kafkaService.publishMessage('account.manager.removed', {
      accountId,
      userId: account.userId,
      timestamp: new Date()
    })

    return account
  }

  async getManagerAccounts(managerId: string) {
    return prisma.account.findMany({
      where: { managerId },
      include: {
        user: true,
        cards: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })
  }

  async updateManagerTerritory(managerId: string, territory: string[]) {
    const manager = await prisma.manager.update({
      where: { id: managerId },
      data: { territory },
      include: {
        user: true,
        accounts: true
      }
    })

    await kafkaService.publishMessage('manager.territory.updated', {
      managerId,
      territory,
      timestamp: new Date()
    })

    return manager
  }

  async getManagersByDepartment(department: string) {
    return prisma.manager.findMany({
      where: { department },
      include: {
        user: true,
        accounts: {
          include: {
            user: true
          }
        }
      }
    })
  }

  async getManagerPerformance(managerId: string, startDate: Date, endDate: Date) {
    const manager = await prisma.manager.findUnique({
      where: { id: managerId },
      include: {
        user: true,
        accounts: {
          include: {
            user: true,
            transactions: {
              where: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          }
        }
      }
    })

    if (!manager) throw new Error('Manager not found')

    const totalAccounts = manager.accounts.length
    const activeAccounts = manager.accounts.filter(acc => acc.isActive).length
    const totalTransactions = manager.accounts.reduce((sum, acc) => sum + acc.transactions.length, 0)
    const totalVolume = manager.accounts.reduce((sum, acc) => {
      return sum + acc.transactions.reduce((txnSum, txn) => txnSum + parseFloat(txn.amount.toString()), 0)
    }, 0)

    const performance = {
      managerId,
      managerName: `${manager.user.firstName} ${manager.user.lastName}`,
      department: manager.department,
      totalAccounts,
      activeAccounts,
      totalTransactions,
      totalVolume,
      period: { startDate, endDate }
    }

    await kafkaService.publishMessage('manager.performance.generated', {
      ...performance,
      timestamp: new Date()
    })

    return performance
  }

  async deactivateManager(managerId: string) {
    const manager = await prisma.manager.update({
      where: { id: managerId },
      data: { isActive: false },
      include: {
        user: true,
        accounts: true
      }
    })

    await prisma.account.updateMany({
      where: { managerId },
      data: { managerId: null }
    })

    await kafkaService.publishMessage('manager.deactivated', {
      managerId,
      userId: manager.userId,
      reassignedAccounts: manager.accounts.length,
      timestamp: new Date()
    })

    return manager
  }
}