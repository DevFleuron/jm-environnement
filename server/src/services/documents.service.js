import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import Document from '../models/Documents.js'
import 'dotenv/config.js'

const uploadDir = process.env.UPLOAD_DIR || 'upload/pdfs'

export async function handleUpload(req, societeId) {
  const file = req.file

  if (!file) {
    throw new Error('Aucun fichier reçu')
  }

  // On crée le sous dossier pour la société
  const societeDir = path.join(uploadDir, societeId)
  if (!fs.existsSync(societeDir)) {
    await fsPromises.mkdir(societeDir, { recursive: true })
  }

  // Déplacer le fichier dans le dossier de la société

  const newPath = path.join(societeDir, file.filename)
  await fsPromises.rename(file.path, newPath)

  const document = new Document({
    societe: societeId,
    nom: req.body.nom || file.originalname,
    type: req.body.type || 'autre',
    fichier: {
      nomOriginal: file.originalname,
      nomStocke: file.filename,
      chemin: path.join(societeId, file.filename),
      taille: file.size,
      mimeType: file.mimetype,
    },
  })
  return await document.save()
}

export async function findBySociete(societeId) {
  return await Document.find({ societe: societeId }).sort({ createdAt: -1 })
}

export async function findById(id) {
  const document = await Document.findById(id)
  if (!document) {
    throw new Error('document non trouvé')
  }
  return document
}

export async function sendFile(id, res) {
  const document = await findById(id)
  const filePath = path.join(uploadDir, document.fichier.chemin)

  if (!fs.existsSync(filePath)) {
    throw new Error('Fichier non trouvé sur le serveur')
  }

  res.download(filePath, document.fichier.nomOriginal)
}

export async function remove(id) {
  const document = await findById(id)

  const filePath = path.join(uploadDir, document.fichier.chemin)
  if (fs.existsSync(filePath)) {
    await fsPromises.unlink(filePath)
  }
  await Document.findByIdAndDelete(id)
  return document
}
