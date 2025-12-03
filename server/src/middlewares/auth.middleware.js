import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Vérifier que l'utilisateur est connecté

export async function authenticate(req, res, next) {
  try {
    // On récupère le token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Accès non autorisé. Token manquant." });
    }

    const token = authHeader.split(" ")[1];

    // On vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On récupère l'utilisateur et on vérifie si il existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    if (!user.actif) {
      return res.status(401).json({ message: "Compte désactivé." });
    }

    // On ajoute l'utilisateur à requête
    req.user = user;
    next();
    // Identification de l'erreur
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré." });
    }
    next(error);
  }
}

// On vérifie que l'utilisateur à le rôle admin
export function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès réservé aux administrateurs." });
  }
  next();
}

// On bloque et envoie un message si utilisateur essaie de changer un fichier qui nécéssite le rôle admin
export function canWrite(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Vous n'avez pas les droits pour faire cela" });
  }
  next();
}

// Pour le moment tout les utilisateurs connectés peuvent lire
export function canRead(req, res, next) {
  next();
}
