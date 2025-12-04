import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authService from "../services/auth.service.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body, "admin");
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Routes publiques
router.post("/login", authController.login);

// Routes pour utilisateur connecté
router.get("/me", authenticate, authController.getMe);
router.put("/change-password", authenticate, authController.changePassword);

// Routes admin
router.post("/users", authenticate, isAdmin, authController.createUser);
router.get("/users", authenticate, isAdmin, authController.getAllUsers);
router.get("/users/:id", authenticate, isAdmin, authController.getUserById);
router.put("/users/:id", authenticate, isAdmin, authController.updateUser);
router.delete("/users/:id", authenticate, isAdmin, authController.deleteUser);

export default router;
