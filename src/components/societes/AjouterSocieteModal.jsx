'use client'

import { useState } from 'react'
import { createSociete } from '@/features/societes/api/societesApi'
import { RxCross2 } from 'react-icons/rx'

const initialFormData = {
  nom: '',
  raisonSociale: '',
  secteurActivite: '',
  formeJuridique: '',
  numeroSiret: '',
  numeroSiren: '',
  adresse: '',
  codePostal: '',
  ville: '',
  contact: {
    civilite: '',
    prenom: '',
    nom: '',
    telephone: '',
    mobile: '',
    email: '',
    fonction: '',
  },
}

export default function AjouterSocieteModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState([])

  function handleChange(e) {
    setErrors([])
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

  const sirenRegex = /^\d{3}\s?\d{3}\s?\d{3}$/
  const siretRegex = /^\d{3}\s?\d{3}\s?\d{3}\s?\d{5}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = []

    if (!formData.nom.trim()) newErrors.push('Le nom de la société est obligatoire')
    if (!formData.ville.trim()) newErrors.push('La ville est obligatoire')
    if (!formData.codePostal.trim()) newErrors.push('Le code postal est obligatoire')
    if (!sirenRegex.test((formData.numeroSiren || '').trim()))
      newErrors.push('Numéro de SIREN invalide ou manquant')
    if (!siretRegex.test((formData.numeroSiret || '').trim()))
      newErrors.push('Numéro de SIRET invalide ou manquant')
    if (!emailRegex.test((formData.contact.email || '').trim()))
      newErrors.push('Email invalide ou manquant')

    // Champs contact obligatoires
    if (!formData.contact.prenom.trim()) newErrors.push('Le prénom du contact est obligatoire')
    if (!formData.contact.nom.trim()) newErrors.push('Le nom du contact est obligatoire')
    if (!formData.contact.email.trim()) newErrors.push('L’email du contact est obligatoire')

    // 2️⃣ Si newErrors → on bloque l’envoi
    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      const societe = await createSociete(formData)
      onCreated(societe)
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2 border rounded-lg outline-none focus:outline-none'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold">Ajouter une société</h2>
          <button
            onClick={onClose}
            className=" border-white text-gray-500 cursor-pointer hover:text-gray-700 "
          >
            <RxCross2 className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Informations entreprise</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom de la société*"
                  value={formData.nom}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="raisonSociale"
                  placeholder="Raison sociale*"
                  value={formData.raisonSociale}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Secteur d'activité"
                  name="secteurActivite"
                  value={formData.secteurActivite}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="numeroSiret"
                  placeholder="Numéro de SIRET*"
                  value={formData.numeroSiret}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="numeroSiren"
                  placeholder="Numéro de SIREN*"
                  value={formData.numeroSiren}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                name="adresse"
                placeholder="Adresse*"
                value={formData.adresse}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="codePostal"
                  placeholder="Code postal*"
                  value={formData.codePostal}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="ville"
                  placeholder="Ville*"
                  value={formData.ville}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Contact principal</h3>
            <div className="grid grid-cols-3 gap-4">
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
                  placeholder="Prénom*"
                  value={formData.contact.prenom}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="contact.nom"
                  placeholder="Nom*"
                  value={formData.contact.nom}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="contact.telephone"
                  placeholder="Téléphone Fixe"
                  value={formData.contact.telephone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="contact.mobile"
                  placeholder="Téléphone Mobile"
                  value={formData.contact.mobile}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <input
                  type="text"
                  name="contact.fonction"
                  placeholder="Fonction"
                  value={formData.contact.fonction}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
              <p className="font-bold">Champs manquants</p>
              <ul className="list-disc list-inside text-sm">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border font-bold cursor-pointer rounded-lg hover:bg-blue-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 bg-[#0c769e] font-bold text-white rounded-xl border hover:bg-white hover:text-[#0c769e] hover:border-[#0c769e] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
