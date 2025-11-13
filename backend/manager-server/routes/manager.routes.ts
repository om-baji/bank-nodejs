import { Router } from 'express'
import { ManagerController } from '../controller/manager.controller'
import { asyncHandler } from "@bank/handlers"

const router = Router()
const managerController = new ManagerController()

router.post('/managers', (managerController.createManager))
router.get('/managers/:id', (managerController.getManager))
router.post('/managers/assign-account', asyncHandler(managerController.assignAccount))
router.delete('/accounts/:accountId/manager', asyncHandler(managerController.removeAccount))
router.get('/managers/:managerId/accounts', asyncHandler(managerController.getManagerAccounts))
router.patch('/managers/:id/territory', asyncHandler(managerController.updateTerritory))
router.get('/managers/:id/performance', asyncHandler(managerController.getPerformance))
router.delete('/managers/:id', asyncHandler(managerController.deactivateManager))
router.get('/departments/:department/managers', asyncHandler(managerController.getByDepartment))

export default router