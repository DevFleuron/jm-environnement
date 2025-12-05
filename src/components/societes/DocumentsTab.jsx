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

  // 👉 état pour le modal de choix de type
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)
  const [selectedTypeForModal, setSelectedTypeForModal] = useState('')

  const typesPresents = documents.map((d) => d.type)

  // 👉 Types encore disponibles (non utilisés)
  const typesDisponibles = TYPES_DOCUMENTS.filter((t) => !typesPresents.includes(t.value))

  const documentsManquants = DOCUMENTS_REQUIS.filter((type) => !typesPresents.includes(type))

  const getTypeLabel = (type) => TYPES_DOCUMENTS.find((t) => t.value === type)?.label || type

  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont acceptés')
      fileInputRef.current.value = ''
      return
    }

    if (typesDisponibles.length === 0) {
      alert('Tous les types de documents sont déjà utilisés.')
      fileInputRef.current.value = ''
      return
    }

    // 👉 on garde le fichier en attente et on ouvre le modal
    setPendingFile(file)
    setSelectedTypeForModal(typesDisponibles[0]?.value || '')
    setShowTypeModal(true)

    // on reset l'input pour pouvoir réuploader le même fichier si besoin
    fileInputRef.current.value = ''
  }

  async function handleConfirmType() {
    if (!pendingFile || !selectedTypeForModal) {
      alert('Veuillez sélectionner un type de document.')
      return
    }

    try {
      setUploading(true)
      await uploadDocument(societeId, pendingFile, selectedTypeForModal)
      await refetch()
      // reset
      setPendingFile(null)
      setSelectedTypeForModal('')
      setShowTypeModal(false)
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  function handleCancelModal() {
    setPendingFile(null)
    setSelectedTypeForModal('')
    setShowTypeModal(false)
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
      refetch() // le type redevient dispo automatiquement
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

  return (
    <>
      <div className="space-y-4 grid grid-cols items-center md:grid-cols-2">
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
                      {getTypeLabel(doc.type)} •{' '}
                      {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
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

        <div className="max-w-full md:ml-auto flex justify-center items-center flex-col md:justify-items-end space-y-8 ">
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
            className="flex items-center text-base font-bold gap-2 px-8 py-2.5 bg-[#0c769e] text-white rounded-2xl cursor-pointer hover:bg-white hover:text-[#0c769e] transition-all duration-180 disabled:opacity-50"
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
      </div>

      {/* MODAL DE CHOIX DE TYPE */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-2">Type de document</h2>
            {pendingFile && (
              <p className="text-sm text-gray-600 mb-4">
                Fichier : <span className="font-medium">{pendingFile.name}</span>
              </p>
            )}

            <div className="space-y-2 max-h-52 overflow-y-auto mb-4">
              {typesDisponibles.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Tous les types de documents sont déjà utilisés.
                </p>
              ) : (
                typesDisponibles.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="radio"
                      name="type-document"
                      value={type.value}
                      checked={selectedTypeForModal === type.value}
                      onChange={(e) => setSelectedTypeForModal(e.target.value)}
                      className="h-4 w-4"
                    />
                    <span>{type.label}</span>
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelModal}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmType}
                disabled={!selectedTypeForModal || uploading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0c769e] text-white hover:bg-[#095b79] disabled:opacity-50"
              >
                {uploading ? 'Import...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
