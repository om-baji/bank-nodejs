import { Router } from 'express'
import { AccountController } from '../controller/account.controller'

const router = Router()
const accountController = new AccountController()

router.post('/accounts', accountController.createAccount)
router.get('/accounts/:id', accountController.getAccount)
router.get('/users/:userId/accounts', accountController.getUserAccounts)
router.post('/accounts/transfer', accountController.transfer)
router.patch('/accounts/:id/freeze', accountController.freezeAccount)
router.get('/accounts/:id/statement', accountController.getStatement)

export default router