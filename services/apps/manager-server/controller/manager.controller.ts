import type { Request, Response } from 'express'
import { ManagerService } from '../action/manager.action'
import { AppError } from '@bank/handlers'

export class ManagerController {
  private managerService: ManagerService

  constructor() {
    this.managerService = new ManagerService()
  }

  createManager = async (req: Request, res: Response) => {
    const manager = await this.managerService.createManager(req.body)
    if (!manager) throw new AppError('Manager creation failed', 400)
    res.status(201).json({ success: true, data: manager })
  }

  getManager = async (req: Request, res: Response) => {
    const { id } = req.params
    const manager = await this.managerService.getManagerById(id)
    if (!manager) throw new AppError('Manager not found', 404)
    res.json({ success: true, data: manager })
  }

  assignAccount = async (req: Request, res: Response) => {
    const { managerId, accountId } = req.body
    if (!managerId || !accountId) throw new AppError('Invalid request data', 409)
    const account = await this.managerService.assignAccountToManager(managerId, accountId)
    if (!account) throw new AppError('Account assignment failed', 400)
    res.json({ success: true, data: account })
  }

  removeAccount = async (req: Request, res: Response) => {
    const { accountId } = req.params
    const account = await this.managerService.removeAccountFromManager(accountId)
    if (!account) throw new AppError('Unable to remove account from manager', 400)
    res.json({ success: true, data: account })
  }

  getManagerAccounts = async (req: Request, res: Response) => {
    const { managerId } = req.params
    if (!managerId) throw new AppError('Invalid managerId', 409)
    const accounts = await this.managerService.getManagerAccounts(managerId)
    res.json({ success: true, data: accounts })
  }

  updateTerritory = async (req: Request, res: Response) => {
    const { id } = req.params
    const { territory } = req.body
    if (!territory) throw new AppError('Territory is required', 409)
    const manager = await this.managerService.updateManagerTerritory(id, territory)
    if (!manager) throw new AppError('Unable to update territory', 400)
    res.json({ success: true, data: manager })
  }

  getPerformance = async (req: Request, res: Response) => {
    const { id } = req.params
    const { startDate, endDate } = req.query
    if (!startDate || !endDate) throw new AppError('Invalid date range', 400)

    const performance = await this.managerService.getManagerPerformance(
      id,
      new Date(startDate as string),
      new Date(endDate as string)
    )

    if (!performance) throw new AppError('Performance data not found', 404)
    res.json({ success: true, data: performance })
  }

  deactivateManager = async (req: Request, res: Response) => {
    const { id } = req.params
    const manager = await this.managerService.deactivateManager(id)
    if (!manager) throw new AppError('Unable to deactivate manager', 400)
    res.json({ success: true, data: manager })
  }

  getByDepartment = async (req: Request, res: Response) => {
    const { department } = req.params
    if (!department) throw new AppError('Invalid department', 409)
    const managers = await this.managerService.getManagersByDepartment(department)
    res.json({ success: true, data: managers })
  }
}
