import type { Request, Response } from 'express'
import { CardService } from '../action/card.action'
import { Decimal } from '@prisma/client'

export class CardController {
  private cardService: CardService

  constructor() {
    this.cardService = new CardService()
  }

  createCard = async (req: Request, res: Response) => {
    try {
      const card = await this.cardService.createCard(req.body)
      res.status(201).json({ success: true, data: card })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getCard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const card = await this.cardService.getCardById(id)
      
      if (!card) {
        return res.status(404).json({ success: false, error: 'Card not found' })
      }
      
      res.json({ success: true, data: card })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getUserCards = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const cards = await this.cardService.getUserCards(userId)
      res.json({ success: true, data: cards })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  blockCard = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const card = await this.cardService.blockCard(id)
      res.json({ success: true, data: card })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  updateLimits = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { dailyLimit, monthlyLimit } = req.body
      
      const card = await this.cardService.updateLimits(
        id,
        dailyLimit ? new Decimal(dailyLimit) : undefined,
        monthlyLimit ? new Decimal(monthlyLimit) : undefined
      )
      
      res.json({ success: true, data: card })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  processTransaction = async (req: Request, res: Response) => {
    try {
      const { cardId, amount, merchantName, type } = req.body
      const transaction = await this.cardService.processTransaction(
        cardId,
        new Decimal(amount),
        merchantName,
        type
      )
      res.json({ success: true, data: transaction })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }
}