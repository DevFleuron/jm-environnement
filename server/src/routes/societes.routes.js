import { Router } from 'express'
import * as societesController from '../controllers/societes.controller.js'

const router = Router()

router.post('/', societesController.create)
router.get('/', societesController.getAll)
router.get('/:id', societesController.getById)
router.put('/:id', societesController.update)
router.delete('/:id', societesController.remove)

export default router
