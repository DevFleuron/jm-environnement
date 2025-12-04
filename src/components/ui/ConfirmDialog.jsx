// components/ui/ConfirmDialog.jsx
"use client";

import { useEffect } from "react";
import Button from "./Button";
import { FiAlertTriangle, FiInfo, FiAlertCircle } from "react-icons/fi";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger", // danger, warning, info
  loading = false,
}) {
  // Fermer avec la touche Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: FiAlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonVariant: "danger",
    },
    warning: {
      icon: FiAlertCircle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonVariant: "primary",
    },
    info: {
      icon: FiInfo,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonVariant: "primary",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        {/* Icône */}
        <div className="flex justify-center pt-8 pb-4">
          <div className={`${config.iconBg} p-4 rounded-full`}>
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
        </div>

        {/* Contenu */}
        <div className="px-8 pb-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 whitespace-pre-line">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-8">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Chargement...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
