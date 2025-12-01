import mongoose from 'mongoose'

const installationSchema = new mongoose.Schema(
  {
    societe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Societe',
      required: true,
    },
    nomAuditeur: {
      type: String,
      trim: true,
    },
    dateAudite: {
      type: Date,
    },
    nomInstallateur: {
      type: String,
      trim: true,
    },
    typeProduit: {
      type: String,
      trim: true,
    },
    nombreProduitInstalle: {
      type: Number,
      default: 1,
    },
    dateInstallation: {
      type: Date,
    },
    dateFinPose: {
      type: Date,
    },
    auditeAccepte: {
      type: Boolean,
      default: null,
    },
    commentaire: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Installation', installationSchema)
