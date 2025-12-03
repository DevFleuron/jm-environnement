import { Router } from "express";
import * as installationsController from "../controllers/installation.controller.js";
import { authenticate, canWrite } from "../middlewares/auth.middleware.js";

const router = Router();

// Permet que chaque route nécéssite d'être connecté
router.use(authenticate);

router.get("/societe/:societeId", installationsController.getBySociete);

// Le canWrite permet l'écriture pour les admins seulement
router.put("/societe/:societeId", canWrite, installationsController.upsert);
router.delete("/:id", canWrite, installationsController.remove);

export default router;
