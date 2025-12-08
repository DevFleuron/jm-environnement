// app/societes/[id]/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
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
import { FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const tabsContainerRef = useRef(null);

  // Vérifier si on peut scroller
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Centrer l'onglet actif sur mobile
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(`[data-tab="${activeTab}"]`);
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  function scrollTabs(direction) {
    const container = tabsContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  async function handleDeleteConfirm() {
    try {
      setDeleting(true);
      await api.delete(`/societes/${params.id}`);
      setShowConfirmDialog(false);
      setToast({
        type: "success",
        message: `La société "${societe.nom}" a été supprimée avec succès`,
      });
      setTimeout(() => {
        router.push("/societes");
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
    <div className="space-y-6 p-4 md:p-10">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="text-[#0c769e] hover:text-[#095a7a] font-medium text-sm flex items-center gap-2 w-fit"
        >
          <span>←</span> Retour à la liste
        </Link>

        {isAdmin && (
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>
        )}
      </div>

      {/* Carte info société */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg border-2 border-[#0c769e] p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <HiBuildingOffice2
            className="w-8 h-8 md:w-9 md:h-9 shrink-0"
            color="#0c769e"
          />
          <div>
            <h1 className="font-bold text-lg md:text-xl text-gray-900">
              {societe.nom}
            </h1>
            {societe.ville && (
              <p className="text-sm text-gray-500">{societe.ville}</p>
            )}
          </div>
        </div>

        {(societe.contact?.prenom || societe.contact?.nom) && (
          <div className="flex items-center gap-3">
            <IoPerson
              className="w-8 h-8 md:w-9 md:h-9 shrink-0"
              color="#0c769e"
            />
            <div className="text-left md:text-right">
              <p className="text-gray-700 font-medium text-sm md:text-base">
                {societe.contact?.prenom} {societe.contact?.nom}
              </p>
              {societe.contact?.fonction && (
                <p className="text-xs md:text-sm text-gray-500">
                  {societe.contact.fonction}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Onglets avec carousel mobile */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Container des onglets */}
        <div className="relative border-b border-gray-200">
          {/* Bouton scroll gauche (mobile uniquement) */}
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white to-transparent px-2 md:hidden"
              aria-label="Faire défiler vers la gauche"
            >
              <FiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {/* Onglets scrollables */}
          <div
            ref={tabsContainerRef}
            className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-shrink-0 snap-center
                  px-4 md:px-6 py-3 
                  text-xs sm:text-sm md:text-base font-bold 
                  whitespace-nowrap 
                  transition-colors relative
                  ${
                    activeTab === tab.id
                      ? "text-[#0c769e] border-b-2 border-[#0c769e]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bouton scroll droite (mobile uniquement) */}
          {canScrollRight && (
            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white to-transparent px-2 md:hidden"
              aria-label="Faire défiler vers la droite"
            >
              <FiChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>

        {/* Contenu de l'onglet */}
        <div className="p-4 md:p-6">
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
