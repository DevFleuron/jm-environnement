import { Router } from 'express'
import * as installationsController from '../controllers/installation.controller.js'

const router = Router()

router.get('/societe/:societeId', installationsController.getBySociete)
router.put('/societe/:societeId', installationsController.upsert)
router.delete('/:id', installationsController.remove)

export default router
