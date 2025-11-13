import Prisma from "@prisma/client"
import { kafkaService } from "../utils/kafka"
import { prisma } from '../utils/db'

export class UserService {
  async createUser(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
      include: {
        accounts: true,
        cards: true
      }
    })

    await kafkaService.publishMessage('user.created', {
      userId: user.id,
      email: user.email,
      timestamp: new Date()
    })

    return user
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        cards: true,
        managers: true
      }
    })
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        cards: true
      }
    })
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        accounts: true,
        cards: true
      }
    })

    await kafkaService.publishMessage('user.updated', {
      userId: user.id,
      changes: data,
      timestamp: new Date()
    })

    return user
  }

  async updateKycStatus(id: string, status: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { kycStatus: status },
      include: { accounts: true }
    })

    await kafkaService.publishMessage('user.kyc.updated', {
      userId: user.id,
      kycStatus: status,
      timestamp: new Date()
    })

    return user
  }

  async deactivateUser(id: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false }
    })

    await kafkaService.publishMessage('user.deactivated', {
      userId: user.id,
      timestamp: new Date()
    })

    return user
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          accounts: true,
          cards: true
        }
      }),
      prisma.user.count()
    ])

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}