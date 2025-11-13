import { Router } from 'express'
import { AccountController } from '../controller/account.controller'
import { asyncHandler } from '../utils/handler'
import { transferHandler, transferSecurityMiddleware } from '../utils/middleware'

const router = Router()
const accountController = new AccountController()

router.post('/accounts', asyncHandler(accountController.createAccount))
router.get('/accounts/:id', asyncHandler(accountController.getAccount))
router.get('/users/:userId/accounts', asyncHandler(accountController.getUserAccounts))
router.post('/accounts/transfer',transferSecurityMiddleware() ,asyncHandler(transferHandler))
router.patch('/accounts/:id/freeze', asyncHandler(accountController.freezeAccount))
router.get('/accounts/:id/statement', asyncHandler(accountController.getStatement))

export default router