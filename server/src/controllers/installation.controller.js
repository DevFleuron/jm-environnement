import * as installationsService from "../services/installation.service.js";

export async function getBySociete(req, res, next) {
  try {
    const { societeId } = req.params;
    const installation = await installationsService.findBySociete(societeId);
    res.json(installation);
  } catch (error) {
    next(error);
  }
}

export async function upsert(req, res, next) {
  try {
    const { societeId } = req.params;
    const installation = await installationsService.upsertBySociete(
      societeId,
      req.body
    );
    res.json(installation);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await installationsService.remove(id);
    res.json({ message: "Installation supprimé avec succès" });
  } catch (error) {
    next(error);
  }
}
