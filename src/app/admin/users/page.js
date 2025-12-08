// src/app/admin/users/page.jsx
"use client";

import { useState, useEffect } from "react";
import { userService } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toast from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  FiUsers,
  FiUserPlus,
  FiTrash2,
  FiShield,
  FiUser,
} from "react-icons/fi";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nom: "",
    prenom: "",
    role: "utilisateur",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setToast({
        type: "error",
        message: "Erreur lors du chargement des utilisateurs",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setSubmitting(true);
      await userService.createUser(formData);
      setShowModal(false);
      setFormData({
        username: "",
        password: "",
        nom: "",
        prenom: "",
        role: "utilisateur",
      });
      setToast({ type: "success", message: "Utilisateur créé avec succès" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(confirmDelete.id);
      setToast({
        type: "success",
        message: "Utilisateur supprimé avec succès",
      });
      setConfirmDelete(null);
      loadUsers();
    } catch (err) {
      setToast({ type: "error", message: "Erreur lors de la suppression" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
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
        title="Supprimer l'utilisateur ?"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete?.username}" ?\n\nCette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Gestion des utilisateurs
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Créez et gérez les comptes utilisateurs
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FiUserPlus className="w-5 h-5" />
            <span>Ajouter un utilisateur</span>
          </Button>
        </div>

        {/* Liste des utilisateurs */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header skeleton */}
            <div className="hidden md:block">
              <div className="bg-[#00a3c4] px-6 py-4">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            {/* Rows skeleton */}
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="w-20 h-8 rounded-full hidden md:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FiUsers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucun utilisateur</p>
            <p className="text-gray-400 text-sm">
              Créez votre premier utilisateur
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Version desktop - Tableau */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#00a3c4] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Prénom
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Nom</th>
                    <th className="px-6 py-4 text-left font-semibold">Rôle</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{user.username}</td>
                      <td className="px-6 py-4">{user.prenom || "-"}</td>
                      <td className="px-6 py-4">{user.nom || "-"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <FiShield className="w-3.5 h-3.5" />
                          ) : (
                            <FiUser className="w-3.5 h-3.5" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.actif
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.actif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setConfirmDelete({
                              id: user._id,
                              username: user.username,
                            })
                          }
                          disabled={user._id === currentUser?.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            user._id === currentUser?.id
                              ? "Vous ne pouvez pas vous supprimer vous-même"
                              : "Supprimer"
                          }
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Version mobile - Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === "admin"
                            ? "bg-purple-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <FiShield className="w-5 h-5 text-purple-600" />
                        ) : (
                          <FiUser className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.prenom} {user.nom}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.actif
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.actif ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          id: user._id,
                          username: user.username,
                        })
                      }
                      disabled={user._id === currentUser?.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Création - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto animate-slideUpMobile sm:animate-scaleIn">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiUserPlus className="w-5 h-5 text-[#00a3c4]" />
                Créer un utilisateur
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Input
                label="Nom d'utilisateur *"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="john.doe"
                required
                disabled={submitting}
              />

              <Input
                label="Mot de passe *"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Minimum 6 caractères"
                required
                disabled={submitting}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  value={formData.prenom}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                  placeholder="John"
                  disabled={submitting}
                />

                <Input
                  label="Nom"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  placeholder="Doe"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  disabled={submitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00a3c4] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="utilisateur">👤 Utilisateur</option>
                  <option value="admin">🛡️ Administrateur</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Les administrateurs ont accès à toutes les fonctionnalités
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Création..." : "Créer"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
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
