"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios.js";

export function useInstallation(societeId) {
  const [installation, setInstallation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInstallation = useCallback(async () => {
    if (!societeId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/installations/societe/${societeId}`);
      setInstallation(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [societeId]);

  useEffect(() => {
    fetchInstallation();
  }, [fetchInstallation]);

  return {
    installation,
    setInstallation,
    loading,
    error,
    refetch: fetchInstallation,
  };
}
