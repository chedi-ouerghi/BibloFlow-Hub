const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentaireSchema = new Schema({
  livreId: {
    type: Schema.Types.ObjectId,
    ref: 'Livre',
    required: [true, 'Le livre est requis'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis'],
    index: true
  },
  contenu: {
    type: String,
    required: [true, 'Le contenu du commentaire est requis'],
    trim: true,
    minlength: [2, 'Le commentaire doit contenir au moins 2 caractères'],
    maxlength: [1000, 'Le commentaire ne doit pas dépasser 1000 caractères']
  },
  estVisible: {
    type: Boolean,
    default: true
  },
  dateModeration: {
    type: Date
  },
  moderateurId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  motifModeration: {
    type: String,
    maxlength: [500, 'Le motif de modération ne doit pas dépasser 500 caractères']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes composés pour les commentaires
commentaireSchema.index({ livreId: 1, userId: 1 });
commentaireSchema.index({ livreId: 1, estVisible: 1, createdAt: -1 });
commentaireSchema.index({ userId: 1, createdAt: -1 });

// Virtuals
commentaireSchema.virtual('utilisateur', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Méthodes d'instance
commentaireSchema.methods.moderer = async function(moderateurId, estVisible, motif) {
  this.estVisible = estVisible;
  this.dateModeration = new Date();
  this.moderateurId = moderateurId;
  if (motif) {
    this.motifModeration = motif;
  }
  return this.save();
};

module.exports = mongoose.model("Commentaire", commentaireSchema);