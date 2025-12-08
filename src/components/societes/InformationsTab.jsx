// components/societes/InformationsTab.jsx
"use client";

import { useState } from "react";
import { updateSociete } from "@/features/societes/api/societesApi";
import Toast from "@/components/ui/Toast";
import { FiSave } from "react-icons/fi";

export default function InformationsTab({ societe, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nom: societe.nom || "",
    raisonSociale: societe.raisonSociale || "",
    secteurActivite: societe.secteurActivite || "",
    formeJuridique: societe.formeJuridique || "",
    numeroSiret: societe.numeroSiret || "",
    numeroSiren: societe.numeroSiren || "",
    adresse: societe.adresse || "",
    codePostal: societe.codePostal || "",
    ville: societe.ville || "",
    contact: {
      civilite: societe.contact?.civilite || "",
      prenom: societe.contact?.prenom || "",
      nom: societe.contact?.nom || "",
      telephone: societe.contact?.telephone || "",
      mobile: societe.contact?.mobile || "",
      email: societe.contact?.email || "",
      fonction: societe.contact?.fonction || "",
    },
  });

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await updateSociete(societe._id, formData);
      onUpdate(updated);
      setToast({ type: "success", message: "Société mise à jour avec succès" });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error.response?.data?.message || "Erreur lors de la mise à jour",
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3 bg-white py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c769e] focus:border-transparent";

  const labelClass = "text-sm font-semibold text-gray-800";

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-[#00a3c4]/15 rounded-lg p-4 md:p-6"
      >
        {/* Section Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🟦 Colonne gauche : Contact principal */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg md:hidden">
              Contact principal
            </h3>

            {/* Civilité */}
            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Civilité</label>
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

            {/* Prénom */}
            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Prénom</label>
              <input
                type="text"
                name="contact.prenom"
                value={formData.contact.prenom}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Nom */}
            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Nom</label>
              <input
                type="text"
                name="contact.nom"
                value={formData.contact.nom}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* 🟩 Colonne droite : Adresse */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg md:hidden">
              Adresse
            </h3>

            {/* Adresse */}
            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Complément 1 */}
            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={`${labelClass} md:invisible`}>Adresse</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Complément d'adresse (optionnel)"
              />
            </div>

            {/* CP / Ville */}
            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>CP / Ville</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                  className={`${inputClass} w-24`}
                  placeholder="CP"
                />
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Ville"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Mobile : Stack vertical | Desktop : Deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche : Informations entreprise */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">
              Informations entreprise
            </h3>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Raison sociale</label>
              <input
                type="text"
                name="raisonSociale"
                value={formData.raisonSociale}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Secteur d'activité</label>
              <input
                type="text"
                name="secteurActivite"
                value={formData.secteurActivite}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Forme juridique</label>
              <input
                type="text"
                name="formeJuridique"
                value={formData.formeJuridique}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Numéro de siret</label>
              <input
                type="text"
                name="numeroSiret"
                value={formData.numeroSiret}
                onChange={handleChange}
                className={inputClass}
                maxLength={14}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Numéro de siren</label>
              <input
                type="text"
                name="numeroSiren"
                value={formData.numeroSiren}
                onChange={handleChange}
                className={inputClass}
                maxLength={9}
              />
            </div>
          </div>

          {/* Colonne droite : Contact et numéros */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Coordonnées</h3>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Téléphone</label>
              <input
                type="tel"
                name="contact.telephone"
                value={formData.contact.telephone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Mobile</label>
              <input
                type="tel"
                name="contact.mobile"
                value={formData.contact.mobile}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] gap-2 md:gap-4 md:items-center">
              <label className={labelClass}>Fonction</label>
              <input
                type="text"
                name="contact.fonction"
                value={formData.contact.fonction}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-[#0c769e] font-bold text-white rounded-xl hover:bg-[#095a7a] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <FiSave className="w-5 h-5" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </>
  );
}
