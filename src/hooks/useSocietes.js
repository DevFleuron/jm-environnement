'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

export function useSocietes(search = '') {
  const [societes, setSocietes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSocietes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = search ? { search } : {}
      const response = await api.get('/societes', { params })
      setSocietes(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchSocietes()
  }, [fetchSocietes])

  return { societes, loading, error, refetch: fetchSocietes }
}

export function useSociete(id) {
  const [societe, setSociete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSociete = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/societes/${id}`)
      setSociete(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchSociete()
  }, [fetchSociete])

  return { societe, setSociete, loading, error, refetch: fetchSociete }
}
