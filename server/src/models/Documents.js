import mongoose, { mongo } from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    societe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Societe",
      required: true,
    },
    nom: {
      type: String,
      required: [true, "le nom du document est requis"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "devis",
        "facture",
        "contrat",
        "attestation",
        "certificat",
        "autre",
      ],
      default: "autre",
    },
    fichier: {
      nomOriginal: { type: String, required: true },
      nomStocke: { type: String, required: true },
      chemin: { type: String, required: true },
      taille: { type: Number },
      mimeType: { type: String },
    },
  },
  { timestamps: true }
);
export default mongoose.model("Document", documentSchema);
