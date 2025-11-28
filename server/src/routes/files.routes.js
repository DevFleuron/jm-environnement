import { Router } from 'express'
import * as filesController from '../controllers/files.controller.js'
import { uploadSinglePdf } from '../middlewares/upload.middleware.js'

const router = Router()

router.post('/upload', uploadSinglePdf, filesController.uploadFile)

router.get('/', filesController.getFiles)

router.get('/:id/download', filesController.downloadFile)

router.get('/download-all', filesController.downloadAllFiles)

export default router
