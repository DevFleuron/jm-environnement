import archiver from 'archiver'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'

const uploadDir = process.env.UPLOAD_DIR || 'uploads/pdfs'

export async function sendAllFilesAsZip(res) {
  const files = await fsPromises.readdir(uploadDir)

  if (!files.length) {
    throw new Error('Aucun fichier à télécharger')
  }

  // 2) Headers de réponse
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', 'attachment; filename="tous-les-pdfs.zip"')

  // 3) Créer l’archive ZIP
  const archive = archiver('zip', { zlib: { level: 9 } })

  archive.on('error', (err) => {
    throw err
  })

  // 4) Pipe vers la réponse HTTP
  archive.pipe(res)

  // 5) Ajouter les fichiers à l’archive
  for (const fileName of files) {
    const fullPath = path.join(uploadDir, fileName)
    const stats = await fsPromises.stat(fullPath)

    if (stats.isFile()) {
      archive.file(fullPath, { name: fileName })
    }
  }

  // 6) Finaliser l’envoi
  await archive.finalize()
}
