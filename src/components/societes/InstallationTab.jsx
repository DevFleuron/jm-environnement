'use client'

import { useState, useEffect } from 'react'
import { useInstallation } from '@/hooks/useInstallation'
import { saveInstallation } from '@/features/installations/api/installationsApi'

export default function InstallationTab({ societeId }) {
  const { installation, loading } = useInstallation(societeId)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nomAuditeur: '',
    dateAudite: '',
    nomInstallateur: '',
    typeProduit: '',
    nombreProduitInstalle: 1,
    dateInstallation: '',
    dateFinPose: '',
    auditeAccepte: null,
    commentaire: '',
  })

  useEffect(() => {
    if (installation) {
      setFormData({
        nomAuditeur: installation.nomAuditeur || '',
        dateAudite: installation.dateAudite ? installation.dateAudite.split('T')[0] : '',
        nomInstallateur: installation.nomInstallateur || '',
        typeProduit: installation.typeProduit || '',
        nombreProduitInstalle: installation.nombreProduitInstalle || 1,
        dateInstallation: installation.dateInstallation
          ? installation.dateInstallation.split('T')[0]
          : '',
        dateFinPose: installation.dateFinPose ? installation.dateFinPose.split('T')[0] : '',
        auditeAccepte: installation.auditeAccepte,
        commentaire: installation.commentaire || '',
      })
    }
  }, [installation])

  function handleChange(e) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const isOui = name === 'auditeAccepteOui'
      setFormData((prev) => ({ ...prev, auditeAccepte: isOui }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setSaving(true)
      await saveInstallation(societeId, formData)
      alert('Installation enregistrée avec succès')
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>
  }

  const inputClass =
    'w-full px-3 py-2 border rounded-lg bg-sky-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'auditeur</label>
          <input
            type="text"
            name="nomAuditeur"
            value={formData.nomAuditeur}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'audite</label>
          <input
            type="date"
            name="dateAudite"
            value={formData.dateAudite}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'installateur
          </label>
          <input
            type="text"
            name="nomInstallateur"
            value={formData.nomInstallateur}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de produit</label>
          <input
            type="text"
            name="typeProduit"
            value={formData.typeProduit}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de produit installé
          </label>
          <select
            name="nombreProduitInstalle"
            value={formData.nombreProduitInstalle}
            onChange={handleChange}
            className={`${inputClass} w-24`}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de l'installation
          </label>
          <input
            type="date"
            name="dateInstallation"
            value={formData.dateInstallation}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin de pose
          </label>
          <input
            type="date"
            name="dateFinPose"
            value={formData.dateFinPose}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Audite accepté ?</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="auditeAccepteOui"
                checked={formData.auditeAccepte === true}
                onChange={handleChange}
                className="rounded"
              />
              Oui
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="auditeAccepteNon"
                checked={formData.auditeAccepte === false}
                onChange={handleChange}
                className="rounded"
              />
              Non
            </label>
          </div>
        </div>
        <div></div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
        <textarea
          name="commentaire"
          value={formData.commentaire}
          onChange={handleChange}
          rows={4}
          className={inputClass}
        />
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
