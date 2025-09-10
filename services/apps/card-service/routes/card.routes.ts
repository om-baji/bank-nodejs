import { Router } from 'express'
import { CardController } from '../controller/card.controller'
import { asyncHandler } from "@bank/handlers"

const router = Router()
const cardController = new CardController()

router.post('/cards', asyncHandler(cardController.createCard))
router.get('/cards/:id', asyncHandler(cardController.getCard))
router.get('/users/:userId/cards', asyncHandler(cardController.getUserCards))
router.patch('/cards/:id/block', asyncHandler(cardController.blockCard))
router.patch('/cards/:id/limits', asyncHandler(cardController.updateLimits))
router.post('/cards/transaction', asyncHandler(cardController.processTransaction))

export default router