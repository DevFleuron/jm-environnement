import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'

const uploadDir = process.env.UPLOAD_DIR || 'uploads/pdfs'

export async function handleUpload(req) {
  const file = req.file

  if (!file) {
    throw new Error('aucun fichier reçu')
  }
  return {
    message: 'Fichier uploadé avec succès',
    originalName: file.originalname,
    fileName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    path: file.path,
  }
}

export async function listFiles() {
  const files = await fsPromises.readdir(uploadDir)

  const result = []

  for (const fileName of files) {
    const fullPath = path.join(uploadDir, fileName)
    const stats = await fsPromises.stat(fullPath)

    if (stats.isFile()) {
      result.push({
        id: fileName,
        fileName,
        size: stats.size,
        createdAt: stats.birthtime,
      })
    }
  }

  return result
}

export async function sendFile(id, res) {
  const filePath = path.join(uploadDir, id)

  if (!fs.existsSync(filePath)) {
    throw new Error('Fichier non trouvé')
  }
  res.download(filePath)
}
