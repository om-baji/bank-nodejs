import { Router } from 'express'
import { UserController } from '../controller/user.controller'
import { asyncHandler } from '../utils/handler'
const router = Router()
const userController = new UserController()

router.post('/users', asyncHandler(userController.createUser))
router.get('/users/:id', asyncHandler(userController.getUser))
router.put('/users/:id', asyncHandler(userController.updateUser))
router.patch('/users/:id/kyc', asyncHandler(userController.updateKyc))
router.delete('/users/:id', asyncHandler(userController.deactivateUser))
router.get('/users', asyncHandler(userController.getAllUsers))

export default router