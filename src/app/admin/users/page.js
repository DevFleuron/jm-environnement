// src/app/admin/users/page.jsx
"use client";

import { useState, useEffect } from "react";
import { userService } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nom: "",
    prenom: "",
    role: "utilisateur",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await userService.createUser(formData);
      setShowModal(false);
      setFormData({
        username: "",
        password: "",
        nom: "",
        prenom: "",
        role: "utilisateur",
      });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await userService.deleteUser(id);
      loadUsers();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-600 mt-1 ">
              Créez et gérez les comptes utilisateurs
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="cursor-pointer">
            + Ajouter un utilisateur
          </Button>
        </div>

        {/* Liste des utilisateurs */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a3c4]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#00a3c4] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Nom d'utilisateur</th>
                  <th className="px-6 py-4 text-left">Prénom</th>
                  <th className="px-6 py-4 text-left">Nom</th>
                  <th className="px-6 py-4 text-left">Rôle</th>
                  <th className="px-6 py-4 text-left">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.prenom}</td>
                    <td className="px-6 py-4">{user.nom}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.actif
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(user._id)}
                        className="text-sm"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Créer un utilisateur
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Nom d'utilisateur"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <Input
                label="Prénom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
              />

              <Input
                label="Nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00a3c4]"
                >
                  <option value="utilisateur">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Créer
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
