import { Router } from 'express'
import { UserController } from '../controller/user.controller'

const router = Router()
const userController = new UserController()

router.post('/users', userController.createUser)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', userController.updateUser)
router.patch('/users/:id/kyc', userController.updateKyc)
router.delete('/users/:id', userController.deactivateUser)
router.get('/users', userController.getAllUsers)

export default router