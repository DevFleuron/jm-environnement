'use client'

import { useState } from 'react'
import { updateSociete } from '@/features/societes/api/societesApi'

export default function InformationsTab({ societe, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: societe.nom || '',
    raisonSociale: societe.raisonSociale || '',
    secteurActivite: societe.secteurActivite || '',
    formeJuridique: societe.formeJuridique || '',
    numeroSiret: societe.numeroSiret || '',
    numeroSiren: societe.numeroSiren || '',
    adresse: societe.adresse || '',
    codePostal: societe.codePostal || '',
    ville: societe.ville || '',
    contact: {
      civilite: societe.contact?.civilite || '',
      prenom: societe.contact?.prenom || '',
      nom: societe.contact?.nom || '',
      telephone: societe.contact?.telephone || '',
      mobile: societe.contact?.mobile || '',
      email: societe.contact?.email || '',
      fonction: societe.contact?.fonction || '',
    },
  })

  function handleChange(e) {
    const { name, value } = e.target
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const updated = await updateSociete(societe._id, formData)
      onUpdate(updated)
      alert('Société mise à jour avec succès')
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border rounded-lg bg-sky-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Civilité</label>
          <select
            name="contact.civilite"
            value={formData.contact.civilite}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">--</option>
            <option value="M.">M.</option>
            <option value="Mme">Mme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            name="contact.prenom"
            value={formData.contact.prenom}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            name="contact.nom"
            value={formData.contact.nom}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            name="contact.telephone"
            value={formData.contact.telephone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CP / Ville</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleChange}
              placeholder="CP"
              className={`${inputClass} w-24`}
            />
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              placeholder="Ville"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="tel"
            name="contact.mobile"
            value={formData.contact.mobile}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Raison sociale</label>
          <input
            type="text"
            name="raisonSociale"
            value={formData.raisonSociale}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité</label>
          <input
            type="text"
            name="secteurActivite"
            value={formData.secteurActivite}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
          <input
            type="text"
            name="contact.fonction"
            value={formData.contact.fonction}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Forme juridique</label>
          <input
            type="text"
            name="formeJuridique"
            value={formData.formeJuridique}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Siret</label>
          <input
            type="text"
            name="numeroSiret"
            value={formData.numeroSiret}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div></div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Siren</label>
          <input
            type="text"
            name="numeroSiren"
            value={formData.numeroSiren}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
