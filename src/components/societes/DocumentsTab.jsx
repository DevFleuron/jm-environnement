// components/societes/DocumentsTab.jsx
"use client";

import { useState, useRef } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuth } from "@/components/AuthProvider";
import {
  uploadDocument,
  downloadDocument,
  deleteDocument,
} from "@/features/documents/api/documentsApi";
import Toast from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { PiUploadSimpleBold } from "react-icons/pi";
import { FiTrash2, FiDownload, FiFile } from "react-icons/fi";

const TYPES_DOCUMENTS = [
  { value: "devis", label: "Devis" },
  { value: "facture", label: "Facture" },
  { value: "contrat", label: "Contrat" },
  { value: "attestation", label: "Attestation" },
  { value: "certificat", label: "Certificat" },
  { value: "autre", label: "Autre" },
];

const DOCUMENTS_REQUIS = ["devis", "contrat"];

export default function DocumentsTab({ societeId }) {
  const { isAdmin } = useAuth();
  const { documents, loading, refetch } = useDocuments(societeId);
  const [uploading, setUploading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef(null);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [selectedTypeForModal, setSelectedTypeForModal] = useState("");

  const typesPresents = documents.map((d) => d.type);
  const typesDisponibles = TYPES_DOCUMENTS.filter(
    (t) => !typesPresents.includes(t.value)
  );
  const documentsManquants = DOCUMENTS_REQUIS.filter(
    (type) => !typesPresents.includes(type)
  );

  const getTypeLabel = (type) =>
    TYPES_DOCUMENTS.find((t) => t.value === type)?.label || type;

  async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setToast({
        type: "error",
        message: "Seuls les fichiers PDF sont acceptés",
      });
      fileInputRef.current.value = "";
      return;
    }

    if (typesDisponibles.length === 0) {
      setToast({
        type: "warning",
        message: "Tous les types de documents sont déjà utilisés.",
      });
      fileInputRef.current.value = "";
      return;
    }

    setPendingFile(file);
    setSelectedTypeForModal(typesDisponibles[0]?.value || "");
    setShowTypeModal(true);
    fileInputRef.current.value = "";
  }

  async function handleConfirmType() {
    if (!pendingFile || !selectedTypeForModal) {
      setToast({
        type: "warning",
        message: "Veuillez sélectionner un type de document.",
      });
      return;
    }

    try {
      setUploading(true);
      await uploadDocument(societeId, pendingFile, selectedTypeForModal);
      await refetch();
      setToast({ type: "success", message: "Document importé avec succès" });
      setPendingFile(null);
      setSelectedTypeForModal("");
      setShowTypeModal(false);
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Erreur lors de l'upload",
      });
    } finally {
      setUploading(false);
    }
  }

  function handleCancelModal() {
    setPendingFile(null);
    setSelectedTypeForModal("");
    setShowTypeModal(false);
  }

  async function handleDownload(doc) {
    try {
      await downloadDocument(doc._id, doc.fichier.nomOriginal);
      setToast({ type: "success", message: "Téléchargement démarré" });
    } catch (error) {
      setToast({ type: "error", message: "Erreur lors du téléchargement" });
    }
  }

  async function handleDeleteConfirm() {
    try {
      await deleteDocument(confirmDelete.id);
      await refetch();
      setToast({ type: "success", message: "Document supprimé avec succès" });
      setConfirmDelete(null);
    } catch (error) {
      setToast({ type: "error", message: "Erreur lors de la suppression" });
    }
  }

  function toggleSelectAll() {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map((d) => d._id));
    }
  }

  function toggleSelect(docId) {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter((id) => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  }

  async function downloadSelected() {
    for (const docId of selectedDocs) {
      const doc = documents.find((d) => d._id === docId);
      if (doc) await handleDownload(doc);
    }
    setSelectedDocs([]);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a3c4]"></div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Supprimer le document ?"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete?.nom}" ?\n\nCette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <div className="space-y-4  ">
        {/* Boutons d'action - Mobile : Stack vertical | Desktop : Horizontal à droite */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 ">
          {/* Sélection (visible seulement si documents) */}
          {documents.length > 0 && (
            <div className="flex items-center ">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.length === documents.length}
                  onChange={toggleSelectAll}
                  className="rounded h-5 w-5"
                />
                <span className="text-sm md:text-base font-semibold">
                  Tout sélectionner ({selectedDocs.length})
                </span>
              </label>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Bouton Télécharger (visible si sélection) */}
            {selectedDocs.length > 0 && (
              <button
                onClick={downloadSelected}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm md:text-base font-bold bg-white border-2 border-[#0c769e] text-[#0c769e] hover:bg-[#0c769e] hover:text-white transition-colors rounded-xl"
              >
                <MdOutlineDownloadForOffline className="w-5 h-5" />
                <span className="hidden sm:inline">Télécharger</span>
                <span className="sm:hidden">
                  Télécharger ({selectedDocs.length})
                </span>
              </button>
            )}

            {/* Bouton Importer (admin only) */}
            {isAdmin && (
              <>
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
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0c769e] text-white rounded-xl hover:bg-[#095a7a] transition-colors disabled:opacity-50 text-sm md:text-base font-bold"
                >
                  <PiUploadSimpleBold className="w-5 h-5" />
                  {uploading ? "Import..." : "Importer"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Liste des documents */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center ">
            <FiFile className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Aucun document</p>
            {isAdmin && (
              <p className="text-sm text-gray-400 mt-2">
                Cliquez sur "Importer" pour ajouter votre premier document
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {/* Header desktop uniquement */}
            <div className="hidden md:grid md:grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 bg-gray-50 border-b font-semibold text-sm text-gray-700">
              <div className="w-12"></div>
              <div>Document</div>
              <div className="w-24 text-center">Actions</div>
            </div>

            {/* Liste */}
            <div className="divide-y bg-[#00a3c4]/15">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto] gap-3 md:gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Checkbox + Icône + Infos */}
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc._id)}
                      onChange={() => toggleSelect(doc._id)}
                      className="rounded h-5 w-5 mt-1 shrink-0"
                    />

                    <FiFile className="w-5 h-5 text-gray-400 shrink-0 mt-1" />

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {doc.nom}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getTypeLabel(doc.type)}
                        </span>
                        <span className="mx-2">•</span>
                        {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:justify-end ml-8 md:ml-0">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#0c769e] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span className="md:hidden">Télécharger</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() =>
                          setConfirmDelete({ id: doc._id, nom: doc.nom })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span className="md:hidden">Supprimer</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents manquants (warning) */}
        {documentsManquants.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  Documents manquants :{" "}
                  {documentsManquants.map(getTypeLabel).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CHOIX DE TYPE - Responsive */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-hidden animate-slideUpMobile sm:animate-scaleIn">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Type de document
              </h2>
              {pendingFile && (
                <p className="text-sm text-gray-600 mt-1 truncate">
                  <span className="font-medium">{pendingFile.name}</span>
                </p>
              )}
            </div>

            {/* Liste des types */}
            <div className="px-6 py-4 max-h-64 overflow-y-auto">
              {typesDisponibles.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Tous les types de documents sont déjà utilisés.
                </p>
              ) : (
                <div className="space-y-3">
                  {typesDisponibles.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="type-document"
                        value={type.value}
                        checked={selectedTypeForModal === type.value}
                        onChange={(e) =>
                          setSelectedTypeForModal(e.target.value)
                        }
                        className="h-5 w-5 flex-shrink-0"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={handleCancelModal}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmType}
                disabled={!selectedTypeForModal || uploading}
                className="px-4 py-2.5 text-sm font-medium rounded-lg bg-[#0c769e] text-white hover:bg-[#095a7a] disabled:opacity-50 transition-colors"
              >
                {uploading ? "Import..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
