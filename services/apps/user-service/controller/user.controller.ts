import type { Request, Response } from 'express'
import { UserService } from '../action/user.action'
import { AppError } from '@bank/handlers'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  createUser = async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body)
    if (!user) throw new AppError('User creation failed', 400)
    res.status(201).json({ success: true, data: user })
  }

  getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await this.userService.getUserById(id)
    if (!user) throw new AppError('User not found', 404)
    res.json({ success: true, data: user })
  }

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await this.userService.updateUser(id, req.body)
    if (!user) throw new AppError('Unable to update user', 400)
    res.json({ success: true, data: user })
  }

  updateKyc = async (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.body
    if (!status) throw new AppError('KYC status is required', 409)
    const user = await this.userService.updateKycStatus(id, status)
    if (!user) throw new AppError('Unable to update KYC status', 400)
    res.json({ success: true, data: user })
  }

  deactivateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await this.userService.deactivateUser(id)
    if (!user) throw new AppError('Unable to deactivate user', 400)
    res.json({ success: true, data: user })
  }

  getAllUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    if (page <= 0 || limit <= 0) throw new AppError('Invalid pagination params', 409)

    const result = await this.userService.getAllUsers(page, limit)
    res.json({ success: true, data: result })
  }
}
