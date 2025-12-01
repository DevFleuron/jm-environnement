import { Router } from 'express'
import * as documentsController from '../controllers/documents.controller.js'
import { uploadSinglePdf } from '../middlewares/upload.middleware.js'

const router = Router()

router.get('/societe/:societeId', documentsController.getBySociete)
router.post('/societe/:societeId', uploadSinglePdf, documentsController.upload)
router.get('/:id/download', documentsController.download)
router.delete('/:id', documentsController.remove)

export default router
