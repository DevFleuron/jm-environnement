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
    const erreurs = []

    if (!formData.nom.trim()) erreurs.push('Le nom de la société est obligatoire')
    if (!formData.ville.trim()) erreurs.push('La ville est obligatoire')
    if (!formData.codePostal.trim()) erreurs.push('Le code postal est obligatoire')

    // Champs contact obligatoires
    if (!formData.contact.prenom.trim()) erreurs.push('Le prénom du contact est obligatoire')
    if (!formData.contact.nom.trim()) erreurs.push('Le nom du contact est obligatoire')
    if (!formData.contact.email.trim()) erreurs.push('L’email du contact est obligatoire')

    // 2️⃣ Si erreurs → on bloque l’envoi
    if (erreurs.length > 0) {
      alert('Merci de compléter les champs obligatoires :\n- ' + erreurs.join('\n- '))
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
                  placeholder="Nom de la société"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="raisonSociale"
                  placeholder="Raison sociale"
                  value={formData.raisonSociale}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="formeJuridique"
                  placeholder="Forme juridique"
                  value={formData.formeJuridique}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="numeroSiret"
                  placeholder="Numéro de SIRET"
                  value={formData.numeroSiret}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus: focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="numeroSiren"
                  placeholder="Numéro de SIREN"
                  value={formData.numeroSiren}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                name="adresse"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="codePostal"
                  placeholder="Code postal"
                  value={formData.codePostal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="ville"
                  placeholder="Ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="contact.nom"
                  placeholder="Nom"
                  value={formData.contact.nom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="contact.telephone"
                  placeholder="Téléphone"
                  value={formData.contact.telephone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="contact.mobile"
                  placeholder="Mobile"
                  value={formData.contact.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="contact.fonction"
                  placeholder="Fonction"
                  value={formData.contact.fonction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

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
