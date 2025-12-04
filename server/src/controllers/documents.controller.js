import * as documentsService from "../services/documents.service.js";

export async function upload(req, res, next) {
  try {
    const { societeId } = req.params;
    const document = await documentsService.handleUpload(req, societeId);
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
}

export async function getBySociete(req, res, next) {
  try {
    const { societeId } = req.params;
    const documents = await documentsService.findBySociete(societeId);
    res.json(documents);
  } catch (error) {
    next(error);
  }
}

export async function download(req, res, next) {
  try {
    const { id } = req.params;
    await documentsService.sendFile(id, res);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await documentsService.remove(id);
    res.json({ message: "Document supprimé avec succès" });
  } catch (error) {
    next(error);
  }
}
