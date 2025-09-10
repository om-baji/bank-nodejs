import type { Request, Response } from 'express'
import { CardService } from '../action/card.action'
import { AppError } from '@bank/handlers'

export class CardController {
  private cardService: CardService

  constructor() {
    this.cardService = new CardService()
  }

  createCard = async (req: Request, res: Response) => {
    const card = await this.cardService.createCard(req.body)
    if (!card) throw new AppError('Card creation failed', 400)
    res.status(201).json({ success: true, data: card })
  }

  getCard = async (req: Request, res: Response) => {
    const { id } = req.params
    const card = await this.cardService.getCardById(id)
    if (!card) throw new AppError('Card not found', 404)
    res.json({ success: true, data: card })
  }

  getUserCards = async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!userId) throw new AppError('Invalid userId', 409)
    const cards = await this.cardService.getUserCards(userId)
    res.json({ success: true, data: cards })
  }

  blockCard = async (req: Request, res: Response) => {
    const { id } = req.params
    const card = await this.cardService.blockCard(id)
    if (!card) throw new AppError('Unable to block card', 400)
    res.json({ success: true, data: card })
  }

  updateLimits = async (req: Request, res: Response) => {
    const { id } = req.params
    const { dailyLimit, monthlyLimit } = req.body

    const card = await this.cardService.updateLimits(
      id,
      dailyLimit ? dailyLimit : undefined,
      monthlyLimit ? monthlyLimit : undefined
    )

    if (!card) throw new AppError('Unable to update limits', 400)
    res.json({ success: true, data: card })
  }

  processTransaction = async (req: Request, res: Response) => {
    const { cardId, amount, merchantName, type } = req.body
    const transaction = await this.cardService.processTransaction(
      cardId,
      amount,
      merchantName,
      type
    )
    if (!transaction) throw new AppError('Transaction failed', 400)
    res.json({ success: true, data: transaction })
  }
}
