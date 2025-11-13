import type { Request, Response } from 'express'
import { AccountService } from '../action/account.action'
import { AppError } from '../utils/handler'

export class AccountController {
  private accountService: AccountService

  constructor() {
    this.accountService = new AccountService()
  }

  createAccount = async (req: Request, res: Response) => {
    const account = await this.accountService.createAccount(req.body)
    res.status(201).json({ success: true, data: account })
  }

  getAccount = async (req: Request, res: Response) => {
    const { id } = req.params
    const account = await this.accountService.getAccountById(id)

    if (!account) throw new AppError('Account not found', 404)

    res.json({ success: true, data: account })
  }

  getUserAccounts = async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!userId) throw new AppError('Invalid userId', 409)
    const accounts = await this.accountService.getUserAccounts(userId)
    res.json({ success: true, data: accounts })
  }

  transfer = async (req: Request, res: Response) => {
    const { fromAccountId, toAccountId, amount, description } = req.body
    const transaction = await this.accountService.transfer(
      fromAccountId,
      toAccountId,
      amount,
      description
    )
    if (!transaction) throw new AppError('Transfer failed', 400)
    res.json({ success: true, data: transaction })
  }

  freezeAccount = async (req: Request, res: Response) => {
    const { id } = req.params
    const account = await this.accountService.freezeAccount(id)
    if (!account) throw new AppError('Unable to freeze account', 400)
    res.json({ success: true, data: account })
  }

  getStatement = async (req: Request, res: Response) => {
    const { id } = req.params
    const { startDate, endDate } = req.query
    if (!startDate || !endDate) throw new AppError('Invalid date range', 400)

    const statement = await this.accountService.getAccountStatement(
      id,
      new Date(startDate as string),
      new Date(endDate as string)
    )

    if (!statement) throw new AppError('Statement not found', 404)

    res.json({ success: true, data: statement })
  }
}
