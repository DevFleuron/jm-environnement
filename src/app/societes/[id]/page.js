'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSociete } from '@/hooks/useSocietes'
import InformationsTab from '@/components/societes/InformationsTab'
import DocumentsTab from '@/components/societes/DocumentsTab'
import InstallationTab from '@/components/societes/InstallationTab'

const TABS = [
  { id: 'informations', label: 'Informations entreprise' },
  { id: 'documents', label: 'Documents' },
  { id: 'installation', label: 'Installation' },
]

export default function SocieteDetailPage() {
  const params = useParams()
  const { societe, setSociete, loading, error } = useSociete(params.id)
  const [activeTab, setActiveTab] = useState('informations')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (error || !societe) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-gray-500">{error || 'Société non trouvée'}</div>
        <Link href="/societes" className="text-sky-500 hover:text-sky-600">
          Retour à la liste
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/societes" className="text-sky-500 hover:text-sky-600 text-sm">
        ← Retour à la liste
      </Link>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-sky-500"
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
            <span className="font-medium text-lg">{societe.nom}</span>
          </div>
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-sky-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-gray-700">
              {societe.contact?.prenom} {societe.contact?.nom}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="flex border-b">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'informations' && (
            <InformationsTab societe={societe} onUpdate={setSociete} />
          )}
          {activeTab === 'documents' && <DocumentsTab societeId={params.id} />}
          {activeTab === 'installation' && <InstallationTab societeId={params.id} />}
        </div>
      </div>
    </div>
  )
}
