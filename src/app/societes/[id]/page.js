'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSociete } from '@/hooks/useSocietes'
import InformationsTab from '@/components/societes/InformationsTab'
import DocumentsTab from '@/components/societes/DocumentsTab'
import InstallationTab from '@/components/societes/InstallationTab'
import { HiBuildingOffice2 } from 'react-icons/hi2'
import { IoPerson } from 'react-icons/io5'

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
        <Link href="/" className="text-sky-500 hover:text-sky-600">
          Retour à la liste
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-10">
      <Link href="/" className="text-sky-500 hover:text-sky-600 text-sm">
        ← Retour à la liste
      </Link>

      <div className="flex rounded-xs border-3 border-[#0c769e] items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <HiBuildingOffice2 className="w-9 h-9" color="#0c769e" />
          <span className="font-bold text-lg">{societe.nom}</span>
        </div>
        <div className="flex items-center gap-3">
          <IoPerson className="w-9 h-9" color="#0c769e" />
          <span className="text-gray-700">
            {societe.contact?.prenom} {societe.contact?.nom}
          </span>
        </div>
      </div>

      <div className="bg-white overflow-hidden">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-bold rounded-tr-3xl rounded-tl-3xl cursor-pointer transition-colors ${
                activeTab === tab.id ? 'bg-[#0c769e] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-[#00a3c4]">
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
