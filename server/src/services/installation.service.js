import Installation from '../models/Installation.js'

export async function findBySociete(societeId) {
  return await Installation.findOne({ societe: societeId })
}

export async function findById(id) {
  const installation = await Installation.findById(id)
  if (!installation) {
    throw new Error('Installation non trouvée ')
  }
  return Installation
}

export async function upsertBySociete(societeId, data) {
  const installation = await Installation.findOneAndUpdate(
    { societe: societeId },
    { ...data, societe: societeId },
    { new: true, upsert: true, runValidators: true }
  )
  return installation
}
