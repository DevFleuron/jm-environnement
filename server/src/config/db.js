import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/jm-environnement";
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur MongoDB: ${error.message}`);
    process.exit(1);
  }
}
