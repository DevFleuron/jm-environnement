'use client'

import { useState } from 'react'
import { updateSociete } from '@/features/societes/api/societesApi'
import { FiSave } from 'react-icons/fi'

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
    'w-full px-3 bg-white py-2 rounded-xs focus:ring-3 focus:ring-[#0c769e] font-bold outline-none'

  const labelClass = 'block w-48 whitespace-nowrap text-sm font-bold'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <label className={labelClass}>Nom de l'auditeur</label>
        <div>
          <select
            name="contact.civilite"
            value={formData.contact.civilite}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Civilité</option>
            <option value="M.">M.</option>
            <option value="Mme">Mme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            name="contact.prenom"
            placeholder="Prénom"
            value={formData.contact.prenom}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <input
            type="text"
            name="contact.nom"
            value={formData.contact.nom}
            onChange={handleChange}
            className={inputClass}
            placeholder="Nom"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleChange}
              placeholder="Code postal"
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="tel"
            name="contact.telephone"
            placeholder="Téléphone fixe"
            value={formData.contact.telephone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <input
            type="tel"
            name="contact.mobile"
            placeholder="Téléphone portable"
            value={formData.contact.mobile}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="raisonSociale"
            placeholder="Raison sociale"
            value={formData.raisonSociale}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <input
            type="email"
            name="contact.email"
            placeholder="Email"
            value={formData.contact.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="secteurActivite"
            placeholder="Secteur d'activité"
            value={formData.secteurActivite}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <input
            type="text"
            name="contact.fonction"
            value={formData.contact.fonction}
            placeholder="Fonction"
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="formeJuridique"
            placeholder="Forme juridique"
            value={formData.formeJuridique}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <input
            type="text"
            name="numeroSiret"
            placeholder="Numéro de siret"
            value={formData.numeroSiret}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div></div>
        <div>
          <input
            type="text"
            name="numeroSiren"
            placeholder="Numéro de siren"
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
          className="px-8 py-3 bg-[#0c769e] font-bold text-white rounded-xl hover:bg-white hover:text-[#0c769e] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <FiSave className="w-6 h-6" />

          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
