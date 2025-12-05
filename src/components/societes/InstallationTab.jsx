'use client'

import { useState, useEffect } from 'react'
import { useInstallation } from '@/hooks/useInstallation'
import { saveInstallation } from '@/features/installations/api/installationsApi'
import { FiSave } from 'react-icons/fi'

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
    'max-w-[480px] md:w-[480px] px-3 py-2 rounded-xs focus:ring-3 focus:ring-[#0c769e] bg-white font-bold outline-none'

  const labelClass = 'block w-48 whitespace-nowrap text-sm font-bold'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Nom de l'auditeur</label>
        <input
          type="text"
          name="nomAuditeur"
          placeholder="Carvalho"
          value={formData.nomAuditeur}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Date de l'audite</label>
        <input
          type="date"
          name="dateAudite"
          value={formData.dateAudite}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Nom de l'installateur</label>
        <input
          type="text"
          name="nomInstallateur"
          placeholder="Chevalier"
          value={formData.nomInstallateur}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Type de produit</label>
        <input
          type="text"
          name="typeProduit"
          placeholder="Led"
          value={formData.typeProduit}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Nombre de produit installé</label>
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

      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Date de l'installation</label>
        <input
          type="date"
          name="dateInstallation"
          value={formData.dateInstallation}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Date de fin de pose</label>
        <input
          type="date"
          name="dateFinPose"
          value={formData.dateFinPose}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols gap-2 md:flex md:items-center md:gap-5">
        <label className={labelClass}>Audite accepté ?</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="auditeAccepteOui"
              checked={formData.auditeAccepte === true}
              onChange={handleChange}
              className="rounded h-4 w-4"
            />
            <span className="text-sm font-bold leading-none">Oui</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="auditeAccepteNon"
              checked={formData.auditeAccepte === false}
              onChange={handleChange}
              className="rounded h-4 w-4"
            />
            <span className="text-sm font-bold leading-none">Non</span>
          </label>
        </div>
      </div>

      <div>
        <textarea
          name="commentaire"
          placeholder="Commentaire"
          value={formData.commentaire}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 rounded-xs focus:ring-3 focus:ring-[#0c769e] bg-white font-bold outline-none"
        />
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#0c769e] font-bold text-white rounded-xl hover:bg-white hover:text-[#0c769e] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <FiSave className="w-6 h-6" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
