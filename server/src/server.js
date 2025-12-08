import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import healthRoutes from "./routes/health.routes.js";
import filesRoutes from "./routes/files.routes.js";
import societesRoutes from "./routes/societes.routes.js";
import documentsRoutes from "./routes/documents.routes.js";
import installationsRoutes from "./routes/installations.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Connexion MongoDB
connectDB();

app.use(
  cors({
    origin: ["http://localhost:3006", "http://192.168.1.128:3006"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 3005;

// Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/societes", societesRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/installations", installationsRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID invalide" });
  }

  res.status(500).json({
    message: err.message || "Erreur serveur",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Serveur backend lancé !`);
  console.log(`    PC:      http://localhost:${PORT}`);
});
