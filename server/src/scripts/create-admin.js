import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";

const ADMIN_USERNAME = process.argv[2];
const ADMIN_PASSWORD = process.argv[3];
const ADMIN_NOM = process.argv[4];
const ADMIN_PRENOM = process.argv[5];

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connecté");

    // On vérifie si l'admin existe pour ne pas faire doublon
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Cet admin existe déjà:", existingAdmin.username);
      process.exit(0);
    }

    // On crée notre admin
    const admin = new User({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      nom: ADMIN_NOM,
      prenom: ADMIN_PRENOM,
      role: "admin",
    });

    await admin.save();
    console.log("admin créé avec succès");
  } catch (error) {
    console.error("Erreur:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
