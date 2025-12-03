import { Router } from "express";
import * as societesController from "../controllers/societes.controller.js";
import { authenticate, canWrite } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", societesController.getAll);
router.get("/:id", societesController.getById);

router.put("/:id", canWrite, societesController.update);
router.delete("/:id", canWrite, societesController.remove);
router.post("/", canWrite, societesController.create);

export default router;
