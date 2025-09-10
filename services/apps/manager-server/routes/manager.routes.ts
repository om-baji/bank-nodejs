import { Router } from 'express'
import { ManagerController } from '../controller/manager.controller'

const router = Router()
const managerController = new ManagerController()

router.post('/managers', managerController.createManager)
router.get('/managers/:id', managerController.getManager)
router.post('/managers/assign-account', managerController.assignAccount)
router.delete('/accounts/:accountId/manager', managerController.removeAccount)
router.get('/managers/:managerId/accounts', managerController.getManagerAccounts)
router.patch('/managers/:id/territory', managerController.updateTerritory)
router.get('/managers/:id/performance', managerController.getPerformance)
router.delete('/managers/:id', managerController.deactivateManager)
router.get('/departments/:department/managers', managerController.getByDepartment)

export default router