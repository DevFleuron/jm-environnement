'use client'

import { useState, useRef } from 'react'
import { useDocuments } from '@/hooks/useDocuments'
import {
  uploadDocument,
  downloadDocument,
  deleteDocument,
} from '@/features/documents/api/documentsApi'
import { MdOutlineDownloadForOffline } from 'react-icons/md'
import { PiUploadSimpleBold } from 'react-icons/pi'

const TYPES_DOCUMENTS = [
  { value: 'devis', label: 'Devis' },
  { value: 'facture', label: 'Facture' },
  { value: 'contrat', label: 'Contrat' },
  { value: 'attestation', label: 'Attestation' },
  { value: 'certificat', label: 'Certificat' },
  { value: 'autre', label: 'Autre' },
]

const DOCUMENTS_REQUIS = ['devis', 'contrat']

export default function DocumentsTab({ societeId }) {
  const { documents, loading, refetch } = useDocuments(societeId)
  const [uploading, setUploading] = useState(false)
  const [selectedDocs, setSelectedDocs] = useState([])
  const fileInputRef = useRef(null)

  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont acceptés')
      return
    }

    const typeIndex = prompt(
      'Type de document:\n' +
        TYPES_DOCUMENTS.map((t, i) => `${i + 1}. ${t.label}`).join('\n') +
        '\n\nEntrez le numéro (1-6):',
      '1'
    )

    const idx = parseInt(typeIndex) - 1
    if (isNaN(idx) || idx < 0 || idx >= TYPES_DOCUMENTS.length) {
      alert('Type invalide')
      return
    }

    try {
      setUploading(true)
      await uploadDocument(societeId, file, TYPES_DOCUMENTS[idx].value)
      refetch()
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      fileInputRef.current.value = ''
    }
  }

  async function handleDownload(doc) {
    try {
      await downloadDocument(doc._id, doc.fichier.nomOriginal)
    } catch (error) {
      alert('Erreur lors du téléchargement')
    }
  }

  async function handleDelete(docId) {
    if (!confirm('Voulez-vous vraiment supprimer ce document ?')) return
    try {
      await deleteDocument(docId)
      refetch()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  function toggleSelectAll() {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([])
    } else {
      setSelectedDocs(documents.map((d) => d._id))
    }
  }

  function toggleSelect(docId) {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter((id) => id !== docId))
    } else {
      setSelectedDocs([...selectedDocs, docId])
    }
  }

  async function downloadSelected() {
    for (const docId of selectedDocs) {
      const doc = documents.find((d) => d._id === docId)
      if (doc) await handleDownload(doc)
    }
  }

  const typesPresents = documents.map((d) => d.type)
  const documentsManquants = DOCUMENTS_REQUIS.filter((type) => !typesPresents.includes(type))
  const getTypeLabel = (type) => TYPES_DOCUMENTS.find((t) => t.value === type)?.label || type

  // if (loading) {
  //   return <div className="text-center py-8 text-gray-500">Chargement...</div>
  // }

  return (
    <div className="space-y-4 grid grid-cols-2">
      <div className="overflow-hidden">
        <div className="px-4 py-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedDocs.length === documents.length && documents.length > 0}
              onChange={toggleSelectAll}
              className="rounded h-4 w-4"
            />
            <span className="text-base font-bold">Tout sélectionner</span>
          </label>
        </div>

        {documents.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">Aucun document</div>
        ) : (
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc._id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc._id)}
                  onChange={() => toggleSelect(doc._id)}
                  className="rounded"
                />
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1">
                  <div className="font-medium">{doc.nom}</div>
                  <div className="text-sm text-gray-500">
                    {getTypeLabel(doc.type)} • {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(doc)}
                  className="text-sky-500 hover:text-sky-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-fit ml-auto flex flex-col justify-items-end space-y-8 ">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center text-base font-bold gap-2 px-4 py-2 bg-[#0c769e] text-white rounded-2xl cursor-pointer hover:bg-white hover:text-[#0c769e] transition-all duration-180 disabled:opacity-50"
        >
          <PiUploadSimpleBold className="w-6 h-6" />
          {uploading ? 'Import...' : 'Importer'}
        </button>
        <button
          onClick={downloadSelected}
          disabled={selectedDocs.length === 0}
          className="flex items-center gap-2 px-4 py-2 text-base font-bold bg-white border-3 cursor-pointer border-[#0c769e] hover:bg-[#0c769e] hover:text-white transition-all duration-180 rounded-2xl"
        >
          <MdOutlineDownloadForOffline className="w-6 h-6" />
          Télécharger
        </button>
      </div>

      {/* {documentsManquants.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            Il manque {documentsManquants.map(getTypeLabel).join(', ')} pour que le dossier soit
            complet
          </span>
        </div>
      )} */}
    </div>
  )
}
