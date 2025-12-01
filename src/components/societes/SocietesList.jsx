'use client'

import Link from 'next/link'

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
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium">{societe.nom}</span>
          </div>
          <Link href={`/societes/${societe._id}`} className="text-sky-500 hover:text-sky-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  )
}
