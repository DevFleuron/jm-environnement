import * as filesService from '../services/files.service.js'

// Reçoit la requête de d'upload
export async function uploadFile(req, res, next) {
  try {
    const result = await filesService.handleUpload(req)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

// Renvoie la liste des fichiers
export async function getFiles(req, res, next) {
  try {
    const files = await filesService.listFiles()
    res.json(files)
  } catch (error) {
    next(error)
  }
}

// Envoie un fichier pour téléchargement
export async function downloadFile(req, res, next) {
  try {
    const { id } = req.params
    await filesService.sendFile(id, res)
  } catch (error) {
    next(error)
  }
}
