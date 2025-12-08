// components/ui/Input.jsx
"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({ label, error, type = "text", ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full px-4 py-2 rounded-lg border 
            focus:outline-none focus:ring-2 focus:ring-[#00a3c4]
            ${error ? "border-red-500" : "border-gray-300"}
            ${isPassword ? "pr-12" : ""}
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          type={isPassword && showPassword ? "text" : type}
          {...props}
        />

        {/* Bouton oeil pour les mots de passe */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
