import type { Request, Response } from 'express'
import { UserService } from '../action/user.action'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body)
      res.status(201).json({ success: true, data: user })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await this.userService.getUserById(id)
      
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' })
      }
      
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await this.userService.updateUser(id, req.body)
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  updateKyc = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      const user = await this.userService.updateKycStatus(id, status)
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  deactivateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await this.userService.deactivateUser(id)
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      
      const result = await this.userService.getAllUsers(page, limit)
      res.json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }
}