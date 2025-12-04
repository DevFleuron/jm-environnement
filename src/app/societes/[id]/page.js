"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSociete } from "@/hooks/useSocietes";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/axios.js";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast from "@/components/ui/Toast";
import InformationsTab from "@/components/societes/InformationsTab";
import DocumentsTab from "@/components/societes/DocumentsTab";
import InstallationTab from "@/components/societes/InstallationTab";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";

const TABS = [
  { id: "informations", label: "Informations entreprise" },
  { id: "documents", label: "Documents" },
  { id: "installation", label: "Installation" },
];

export default function SocieteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { societe, setSociete, loading, error } = useSociete(params.id);
  const [activeTab, setActiveTab] = useState("informations");
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleDeleteConfirm() {
    try {
      setDeleting(true);
      await api.delete(`/societes/${params.id}`);

      // Fermer le dialog
      setShowConfirmDialog(false);

      // Afficher le toast de succès
      setToast({
        type: "success",
        message: `La société "${societe.nom}" a été supprimée avec succès`,
      });

      // Rediriger après 1 seconde
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setDeleting(false);
      setToast({
        type: "error",
        message:
          error.response?.data?.message || "Erreur lors de la suppression",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a3c4]"></div>
      </div>
    );
  }

  if (error || !societe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-xl text-gray-500">
          {error || "Société non trouvée"}
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-[#0c769e] text-white rounded-lg hover:bg-[#095a7a] transition-colors"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        variant="danger"
        title="Supprimer la société ?"
        message={`Vous êtes sur le point de supprimer "${societe.nom}".\n\nCette action est irréversible et supprimera :\n• Toutes les informations de la société\n• Tous les documents associés\n• Toutes les installations associées\n\nÊtes-vous sûr de vouloir continuer ?`}
        confirmText="Oui, supprimer"
        cancelText="Annuler"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-[#0c769e] hover:text-[#095a7a] font-medium text-sm flex items-center gap-2"
        >
          <span>←</span> Retour à la liste
        </Link>

        {isAdmin && (
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Supprimer la société</span>
          </button>
        )}
      </div>

      {/* Carte info société */}
      <div className="flex rounded-lg border-2 border-[#0c769e] items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <HiBuildingOffice2 className="w-9 h-9" color="#0c769e" />
          <div>
            <h1 className="font-bold text-xl text-gray-900">{societe.nom}</h1>
            {societe.ville && (
              <p className="text-sm text-gray-500">{societe.ville}</p>
            )}
          </div>
        </div>

        {(societe.contact?.prenom || societe.contact?.nom) && (
          <div className="flex items-center gap-3">
            <IoPerson className="w-9 h-9" color="#0c769e" />
            <div className="text-right">
              <p className="text-gray-700 font-medium">
                {societe.contact?.prenom} {societe.contact?.nom}
              </p>
              {societe.contact?.fonction && (
                <p className="text-sm text-gray-500">
                  {societe.contact.fonction}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-bold transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#0c769e] border-b-2 border-[#0c769e]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "informations" && (
            <InformationsTab societe={societe} onUpdate={setSociete} />
          )}
          {activeTab === "documents" && <DocumentsTab societeId={params.id} />}
          {activeTab === "installation" && (
            <InstallationTab societeId={params.id} />
          )}
        </div>
      </div>
    </div>
  );
}
