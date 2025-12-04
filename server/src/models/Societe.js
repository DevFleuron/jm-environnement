import mongoose from 'mongoose'

const societeSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom de la société est requis'],
      trim: true,
    },
    raisonSociale: {
      type: String,
      trim: true,
    },
    secteurActivite: {
      type: String,
      trim: true,
    },
    formeJuridique: {
      type: String,
      trim: true,
    },
    numeroSiret: {
      type: String,
      trim: true,
    },
    numeroSiren: {
      type: String,
      trim: true,
    },
    adresse: {
      type: String,
      trim: true,
    },
    codePostal: {
      type: String,
      trim: true,
    },
    ville: {
      type: String,
      trim: true,
    },
    contact: {
      civilite: {
        type: String,
        enum: ['', 'M.', 'Mme', 'Autre'],
        default: '',
      },
      prenom: { type: String, trim: true },
      nom: { type: String, trim: true },
      telephone: { type: String, trim: true },
      mobile: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      fonction: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
)

societeSchema.index({ nom: 'text', raisonSociale: 'text', 'contact.nom': 'text' })

export default mongoose.model('Societe', societeSchema)
