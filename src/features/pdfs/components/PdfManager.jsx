'use client'

import { useEffect, useState } from 'react'
import { uploadPdf, getPdfs } from '../api/pdfApi'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function PdfManager() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Charger la liste au montage du composant
  useEffect(() => {
    refreshFiles()
  }, [])

  async function refreshFiles() {
    try {
      setError('')
      const data = await getPdfs()
      setFiles(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedFile) {
      setError('Sélectionne un fichier PDF')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await uploadPdf(selectedFile)
      setSuccess(result.message || 'Fichier uploadé')
      setSelectedFile(null)
      // On réinitialise l’input file à la main
      e.target.reset()
      // On recharge la liste
      await refreshFiles()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file && file.type !== 'application/pdf') {
      setError('Le fichier doit être un PDF')
      setSelectedFile(null)
      return
    }
    setError('')
    setSelectedFile(file || null)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Uploader un PDF</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer le fichier'}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div>
        <h2 className="font-semibold mb-2">Fichiers disponibles</h2>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun fichier pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between border rounded px-3 py-2"
              >
                <div>
                  <p className="font-medium text-sm">{file.fileName}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} Ko</p>
                </div>
                <a
                  href={`${API_URL}/api/files/${encodeURIComponent(file.id)}/download`}
                  className="text-blue-600 text-sm underline"
                >
                  Télécharger
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
