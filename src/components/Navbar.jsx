// components/Navbar.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { FiLogOut, FiUsers } from "react-icons/fi";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  // Ne pas afficher la navbar sur la page de login
  if (pathname === "/login") return null;

  const navLinks = [
    { href: "/societes", label: "Sociétés" },
    { href: "/documents", label: "Documents" },
    { href: "/installations", label: "Installations" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-jm-environnement.webp"
              alt="JM-Environnement"
              width={120}
              height={50}
              className="object-contain"
              priority
            />
          </Link>

          {/* Partie droite : User info + Actions */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Lien vers la création de users (visible seulement pour les admins) */}
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#00A3C4]/30 text-[#00A3C4] hover:bg-purple-200 transition-colors"
                >
                  <FiUsers className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Info utilisateur */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>

              {/* Bouton déconnexion */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
