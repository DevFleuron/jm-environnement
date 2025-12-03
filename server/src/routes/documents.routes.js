import { Router } from "express";
import * as documentsController from "../controllers/documents.controller.js";
import { uploadSinglePdf } from "../middlewares/upload.middleware.js";
import { authenticate, canWrite } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

// Ces deux routes sont pour tout utilisateurs connectés
router.get("/societe/:societeId", documentsController.getBySociete);
router.get("/:id/download", documentsController.download);

// Seulement pour admin
router.post(
  "/societe/:societeId",
  canWrite,
  uploadSinglePdf,
  documentsController.upload
);
router.delete("/:id", canWrite, documentsController.remove);

export default router;
