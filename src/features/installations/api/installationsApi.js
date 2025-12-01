import api from '@/lib/api'

export async function saveInstallation(societeId, data) {
  const response = await api.put(`/installations/societe/${societeId}`, data)
  return response.data
}
