const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function uploadPdf(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_URL}/api/files/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Erreur lors de l’upload')
  }

  return res.json()
}

// Récupérer la liste des PDFs
export async function getPdfs() {
  const res = await fetch(`${API_URL}/api/files`, {
    method: 'GET',
    cache: 'no-store', // optionnel, pour être sûr d'avoir la liste à jour
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Erreur lors de la récupération des fichiers')
  }

  return res.json()
}
