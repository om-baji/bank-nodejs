import type { Request, Response } from 'express'
import { ManagerService } from '../action/manager.action'

export class ManagerController {
  private managerService: ManagerService

  constructor() {
    this.managerService = new ManagerService()
  }

  createManager = async (req: Request, res: Response) => {
    try {
      const manager = await this.managerService.createManager(req.body)
      res.status(201).json({ success: true, data: manager })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getManager = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const manager = await this.managerService.getManagerById(id)
      
      if (!manager) {
        return res.status(404).json({ success: false, error: 'Manager not found' })
      }
      
      res.json({ success: true, data: manager })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  assignAccount = async (req: Request, res: Response) => {
    try {
      const { managerId, accountId } = req.body
      const account = await this.managerService.assignAccountToManager(managerId, accountId)
      res.json({ success: true, data: account })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  removeAccount = async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params
      const account = await this.managerService.removeAccountFromManager(accountId)
      res.json({ success: true, data: account })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getManagerAccounts = async (req: Request, res: Response) => {
    try {
      const { managerId } = req.params
      const accounts = await this.managerService.getManagerAccounts(managerId)
      res.json({ success: true, data: accounts })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  updateTerritory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { territory } = req.body
      const manager = await this.managerService.updateManagerTerritory(id, territory)
      res.json({ success: true, data: manager })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getPerformance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { startDate, endDate } = req.query
      
      const performance = await this.managerService.getManagerPerformance(
        id,
        new Date(startDate as string),
        new Date(endDate as string)
      )
      
      res.json({ success: true, data: performance })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  deactivateManager = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const manager = await this.managerService.deactivateManager(id)
      res.json({ success: true, data: manager })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getByDepartment = async (req: Request, res: Response) => {
    try {
      const { department } = req.params
      const managers = await this.managerService.getManagersByDepartment(department)
      res.json({ success: true, data: managers })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }
}