'use client'

import { useState, useEffect } from 'react'
import { useSocietes } from '@/hooks/useSocietes'
import SocietesList from '@/components/societes/SocietesList'
import AjouterSocieteModal from '@/components/societes/AjouterSocieteModal'

export default function SocietesPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { societes, loading, refetch } = useSocietes(debouncedSearch)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  function handleSocieteCreated(nouvelleSociete) {
    refetch()
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Recherche par nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="grid grid-cols-[1fr,auto] gap-4 px-4 py-3 bg-gray-50 border-b font-medium text-gray-700">
          <div className="flex items-center gap-2">Nom de la société</div>
          <div>Action</div>
        </div>

        <SocietesList societes={societes} loading={loading} />
      </div>

      {showModal && (
        <AjouterSocieteModal onClose={() => setShowModal(false)} onCreated={handleSocieteCreated} />
      )}
    </div>
  )
}
