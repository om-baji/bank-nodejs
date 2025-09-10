import type { Request, Response } from 'express'
import { AccountService } from '../action/account.action'
import { Decimal } from '@prisma/client'

export class AccountController {
  private accountService: AccountService

  constructor() {
    this.accountService = new AccountService()
  }

  createAccount = async (req: Request, res: Response) => {
    try {
      const account = await this.accountService.createAccount(req.body)
      res.status(201).json({ success: true, data: account })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getAccount = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const account = await this.accountService.getAccountById(id)
      
      if (!account) {
        return res.status(404).json({ success: false, error: 'Account not found' })
      }
      
      res.json({ success: true, data: account })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getUserAccounts = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const accounts = await this.accountService.getUserAccounts(userId)
      res.json({ success: true, data: accounts })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  transfer = async (req: Request, res: Response) => {
    try {
      const { fromAccountId, toAccountId, amount, description } = req.body
      const transaction = await this.accountService.transfer(
        fromAccountId,
        toAccountId,
        new Decimal(amount),
        description
      )
      res.json({ success: true, data: transaction })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  freezeAccount = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const account = await this.accountService.freezeAccount(id)
      res.json({ success: true, data: account })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getStatement = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { startDate, endDate } = req.query
      
      const statement = await this.accountService.getAccountStatement(
        id,
        new Date(startDate as string),
        new Date(endDate as string)
      )
      
      res.json({ success: true, data: statement })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }
}