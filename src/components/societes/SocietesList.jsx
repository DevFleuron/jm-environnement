'use client'

import Link from 'next/link'
import { FaFolderOpen } from 'react-icons/fa'
import { HiBuildingOffice2 } from 'react-icons/hi2'

export default function SocietesList({ societes, loading }) {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>
  }

  if (societes.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune société trouvée</div>
  }

  return (
    <div className="divide-y divide-gray-200">
      {societes.map((societe) => (
        <div
          key={societe._id}
          className="flex border mt-2 items-center justify-between px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <HiBuildingOffice2 className="w-9 h-9" color="#0c769e" />
            <span className="font-bold text-lg">{societe.nom}</span>
          </div>
          <Link href={`/societes/${societe._id}`} className="text-sky-500 hover:text-sky-600">
            <FaFolderOpen className="w-9 h-9" color="#0c769e" />
          </Link>
        </div>
      ))}
    </div>
  )
}
