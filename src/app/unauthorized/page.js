"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a3c4] to-[#0c769e] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-jm-environnement.webp"
            alt="JM-Environnement"
            width={180}
            height={70}
            className="object-contain"
          />
        </div>

        {/* Icône 403 */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-6xl font-bold text-red-600 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Accès non autorisé
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Cette section est réservée aux administrateurs.
        </p>

        {/* Boutons */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full">Retour à l'accueil</Button>
          </Link>

          <Button variant="secondary" className="w-full" onClick={logout}>
            Se déconnecter
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Si vous pensez qu'il s'agit d'une erreur, contactez votre
          administrateur.
        </p>
      </div>
    </div>
  );
}
