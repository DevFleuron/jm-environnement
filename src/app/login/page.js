// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Identifiant ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a3c4] to-[#0c769e] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-jm-environnement.webp"
            alt="JM-Environnement"
            width={200}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Connexion
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Accédez à votre espace de gestion
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Nom d'utilisateur"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom d'utilisateur"
            required
            disabled={loading}
          />

          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
            disabled={loading}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          JM-Environnement © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
