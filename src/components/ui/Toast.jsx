// components/ui/Toast.jsx
"use client";

import { useEffect } from "react";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

export default function Toast({
  message,
  type = "success", // success, error, warning, info
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      icon: FiCheck,
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    error: {
      icon: FiX,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    warning: {
      icon: FiAlertCircle,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    info: {
      icon: FiInfo,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md animate-slideInRight`}>
      <div
        className={`${config.bg} ${config.border} border rounded-lg shadow-lg p-4`}
      >
        <div className="flex items-start gap-3">
          <div className={`${config.iconBg} p-2 rounded-lg shrink-0`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <p className={`${config.text} font-medium text-sm`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`${config.text} hover:opacity-70 transition-opacity`}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
