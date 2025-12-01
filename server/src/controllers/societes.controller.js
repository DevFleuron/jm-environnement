import * as societesService from '../services/societes.service.js'

export async function create(req, res, next) {
  try {
    const societe = await societesService.create(req.body)
    res.status(201).json(societe)
  } catch (error) {
    next(error)
  }
}

export async function getAll(req, res, next) {
  try {
    const { search } = req.query
    const societes = await societesService.findAll(search)
    res.json(societes)
  } catch (error) {
    next(error)
  }
}

export async function getById(req, res, next) {
  try {
    const societe = await societesService.findById(req.params.id)
    res.json(societe)
  } catch (error) {
    next(error)
  }
}

export async function update(req, res, next) {
  try {
    const societe = await societesService.update(req.params.id, req.body)
    res.json(societe)
  } catch (error) {
    next(error)
  }
}

export async function remove(req, res, next) {
  try {
    await societesService.remove(req.params.id)
    res.json({ message: 'Société supprimée avec succès' })
  } catch (error) {
    next(error)
  }
}
