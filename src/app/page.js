'use client'

import { useState, useEffect } from 'react'
import { IoSearch } from 'react-icons/io5'
import { useSocietes } from '@/hooks/useSocietes'
import SocietesList from '@/components/societes/SocietesList'
import AjouterSocieteModal from '@/components/societes/AjouterSocieteModal'
import { FaFileCirclePlus } from 'react-icons/fa6'

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
    <div className="space-y-6 px-10">
      <div className="flex gap-4 border border-xs p-2">
        <div className="flex-1 relative">
          <IoSearch className="absolute top-1 w-8 h-8" color="#0c769e" />
          <input
            type="text"
            placeholder="Recherche par nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none ring-0 pl-10 pr-4 py-2.5 border-none font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0c769e] text-white rounded-lg font-bold hover:[#0c769e] cursor-pointer hover:scale-95"
        >
          <FaFileCirclePlus className="h-6 w-6" />
          Ajouter
        </button>
      </div>

      <div className="bg-white  overflow-hidden">
        <div className="flex items-center ml-2 font-semibold text-xl gap-2">
          <p>Nom de la société</p>
        </div>
        <SocietesList societes={societes} loading={loading} />
      </div>

      {showModal && (
        <AjouterSocieteModal onClose={() => setShowModal(false)} onCreated={handleSocieteCreated} />
      )}
    </div>
  )
}
