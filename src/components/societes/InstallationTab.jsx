// components/societes/InstallationTab.jsx
"use client";

import { useState, useEffect } from "react";
import { useInstallation } from "@/hooks/useInstallation";
import { saveInstallation } from "@/features/installations/api/installationsApi";
import Toast from "@/components/ui/Toast";
import { FiSave, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function InstallationTab({ societeId }) {
  const { installation, loading } = useInstallation(societeId);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nomAuditeur: "",
    dateAudite: "",
    nomInstallateur: "",
    typeProduit: "",
    nombreProduitInstalle: 1,
    dateInstallation: "",
    dateFinPose: "",
    auditeAccepte: null,
    commentaire: "",
  });

  useEffect(() => {
    if (installation) {
      setFormData({
        nomAuditeur: installation.nomAuditeur || "",
        dateAudite: installation.dateAudite
          ? installation.dateAudite.split("T")[0]
          : "",
        nomInstallateur: installation.nomInstallateur || "",
        typeProduit: installation.typeProduit || "",
        nombreProduitInstalle: installation.nombreProduitInstalle || 1,
        dateInstallation: installation.dateInstallation
          ? installation.dateInstallation.split("T")[0]
          : "",
        dateFinPose: installation.dateFinPose
          ? installation.dateFinPose.split("T")[0]
          : "",
        auditeAccepte: installation.auditeAccepte,
        commentaire: installation.commentaire || "",
      });
    }
  }, [installation]);

  function handleChange(e) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const isOui = name === "auditeAccepteOui";
      setFormData((prev) => ({ ...prev, auditeAccepte: isOui }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await saveInstallation(societeId, formData);
      setToast({
        type: "success",
        message: "Installation enregistrée avec succès",
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error.response?.data?.message || "Erreur lors de l'enregistrement",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a3c4]"></div>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c769e] focus:border-transparent bg-white";

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
        className="space-y-6 bg-[#00a3c4]/15 rounded-lg p-4 md:p-6"
      >
        {/* Section Audit */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg border-b pb-2">
            Informations d'audit
          </h3>

          {/* Nom de l'auditeur */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center md:w-[31%]">
            <label className={labelClass}>Nom de l'auditeur</label>
            <input
              type="text"
              name="nomAuditeur"
              placeholder="Dupont"
              value={formData.nomAuditeur}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Date de l'audite */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center">
            <label className={labelClass}>Date de l'audit</label>
            <input
              type="date"
              name="dateAudite"
              value={formData.dateAudite}
              onChange={handleChange}
              className={`${inputClass} md:max-w-xs`}
            />
          </div>

          {/* Audite accepté */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center">
            <label className={labelClass}>Audit accepté ?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-green-500 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="auditeAccepteOui"
                  checked={formData.auditeAccepte === true}
                  onChange={handleChange}
                  className="rounded h-5 w-5 text-green-600 focus:ring-green-500"
                />
                <FiCheckCircle
                  className={`w-5 h-5 ${
                    formData.auditeAccepte === true
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span className="text-sm font-semibold">Oui</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-red-500 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="auditeAccepteNon"
                  checked={formData.auditeAccepte === false}
                  onChange={handleChange}
                  className="rounded h-5 w-5 text-red-600 focus:ring-red-500"
                />
                <FiXCircle
                  className={`w-5 h-5 ${
                    formData.auditeAccepte === false
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                />
                <span className="text-sm font-semibold">Non</span>
              </label>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200"></div>

        {/* Section Installation */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg border-b pb-2">
            Informations d'installation
          </h3>

          {/* Nom de l'installateur */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center w-[31%]">
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

          {/* Type de produit */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center w-[31%]">
            <label className={labelClass}>Type de produit</label>
            <input
              type="text"
              name="typeProduit"
              placeholder="LED, Panneau solaire..."
              value={formData.typeProduit}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Nombre de produits */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center">
            <label className={labelClass}>Nombre de produit installé</label>
            <select
              name="nombreProduitInstalle"
              value={formData.nombreProduitInstalle}
              onChange={handleChange}
              className={`${inputClass} md:max-w-xs`}
            >
              {[...Array(50)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          {/* Date de l'installation */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center">
            <label className={labelClass}>Date de l'installation</label>
            <input
              type="date"
              name="dateInstallation"
              value={formData.dateInstallation}
              onChange={handleChange}
              className={`${inputClass} md:max-w-xs`}
            />
          </div>

          {/* Date de fin de pose */}
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-2 md:gap-4 md:items-center">
            <label className={labelClass}>Date de fin de pose</label>
            <input
              type="date"
              name="dateFinPose"
              value={formData.dateFinPose}
              onChange={handleChange}
              className={`${inputClass} md:max-w-xs`}
            />
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200"></div>

        {/* Section Commentaire */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg border-b pb-2">
            Commentaires
          </h3>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Commentaire additionnel</label>
            <textarea
              name="commentaire"
              placeholder="Ajoutez vos observations, remarques ou informations complémentaires..."
              value={formData.commentaire}
              onChange={handleChange}
              rows={3}
              className={`px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c769e] focus:border-transparent bg-white w-[31%] resize-none `}
            />
            <p className="text-xs text-gray-500">
              {formData.commentaire.length} caractères
            </p>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-8 py-3 bg-[#0c769e] font-bold text-white rounded-xl hover:bg-[#095a7a] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <FiSave className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </>
  );
}
