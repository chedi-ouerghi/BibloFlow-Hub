const mongoose = require("mongoose");
const { Schema } = mongoose;

const auteurSchema = new Schema({
  nom: {
    type: String,
    required: [true, "Le nom est requis"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"],
    maxlength: [50, "Le nom ne doit pas dépasser 50 caractères"]
  },
  nationalite: {
    type: String,
    required: [true, "La nationalité est requise"],
    trim: true,
    default: "Non spécifiée"
  },
  bio: {
    type: String,
    required: [true, "La biographie est requise"],
    minlength: [10, "La biographie doit contenir au moins 10 caractères"],
    maxlength: [1000, "La biographie ne doit pas dépasser 1000 caractères"],
    default: ""
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Modification ici pour permettre la création sans user
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'active'  // Changé à 'active' par défaut pour les auteurs créés par l'admin
  },
  isValidated: {
    type: Boolean,
    default: true  // Changé à true par défaut pour les auteurs créés par l'admin
  },
  dateValidation: {
    type: Date,
    default: Date.now  // Ajout d'une date par défaut
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtuals
auteurSchema.virtual('livres', {
  ref: 'Livre',
  localField: '_id',
  foreignField: 'auteur',
  match: { statut: 'published' }
});

auteurSchema.virtual('livresCount', {
  ref: 'Livre',
  localField: '_id',
  foreignField: 'auteur',
  count: true,
  match: { statut: 'published' }
});

// Indexes
auteurSchema.index({ nom: 'text', bio: 'text' });

module.exports = mongoose.model("Auteur", auteurSchema);
