import { Router } from 'express'
import { CardController } from '../controller/card.controller'

const router = Router()
const cardController = new CardController()

router.post('/cards', cardController.createCard)
router.get('/cards/:id', cardController.getCard)
router.get('/users/:userId/cards', cardController.getUserCards)
router.patch('/cards/:id/block', cardController.blockCard)
router.patch('/cards/:id/limits', cardController.updateLimits)
router.post('/cards/transaction', cardController.processTransaction)

export default router