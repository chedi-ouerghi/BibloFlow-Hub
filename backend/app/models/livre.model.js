const mongoose = require('mongoose');
const { Schema } = mongoose;

const STATUTS = {
  DRAFT: 'draft',
  HIDDEN: 'hidden',
  PUBLISHED: 'published'
};

const livreSchema = new Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    minlength: [2, 'Le titre doit contenir au moins 2 caractères'],
    maxlength: [100, 'Le titre ne doit pas dépasser 100 caractères']
  },
  isbn: {
    type: String,
    required: [true, 'L\'ISBN est requis'],
    unique: true,
    trim: true,
    match: [/^(?:\d{10}|\d{13})$/, 'Format ISBN invalide (10 ou 13 chiffres)']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    minlength: [10, 'La description doit contenir au moins 10 caractères'],
    maxlength: [2000, 'La description ne doit pas dépasser 2000 caractères']
  },
  couvertureUrl: {
    type: String,
    required: [true, 'L\'URL de la couverture est requise'],
    trim: true,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i, 'URL de couverture invalide']
  },
  langue: {
    type: String,
    required: [true, 'La langue est requise'],
    trim: true
  },
  nombrePages: {
    type: Number,
    required: [true, 'Le nombre de pages est requis'],
    min: [1, 'Le nombre de pages doit être supérieur à 0']
  },
  auteur: {
    type: Schema.Types.ObjectId,
    ref: 'Auteur',
    required: true  
  },
  nomAuteur: {
    type: String,
    // required: [true, 'Le nom de l\'auteur est requis']
  },
  nationaliteAuteur: {
    type: String,
    default: 'Non spécifiée'  // Changé pour correspondre au modèle Auteur
  },
  bioAuteur: {
    type: String
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'CategorieLivre',
    required: [true, 'Au moins une catégorie est requise']
  }],
  statut: {
    type: String,
    enum: Object.values(STATUTS),
    default: STATUTS.DRAFT,
    required: true,
    index: true
  },
  noteMoyenne: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    get: v => Math.round(v * 10) / 10 // Arrondir à 1 décimale
  },
  sommeNotes: {
    type: Number,
    default: 0,
    min: 0
  },
  nombreCommentaires: {
    type: Number,
    default: 0,
    min: 0
  },
  nombreNotes: {
    type: Number,
    default: 0,
    min: 0
  },
  datePublication: {
    type: Date
  },
  dateCreation: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  dateMiseAJour: {
    type: Date,
    default: Date.now
  },
  motifHidden: {
    type: String,
    maxlength: [500, 'Le motif de masquage ne doit pas dépasser 500 caractères'],
    required: function() {
      return this.statut === STATUTS.HIDDEN;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

// Virtuals
livreSchema.virtual('commentaires', {
  ref: 'Commentaire',
  localField: '_id',
  foreignField: 'livreId'
});

// Indexes
livreSchema.index({ titre: 'text', description: 'text' });
livreSchema.index({ statut: 1, auteur: 1 });
livreSchema.index({ categories: 1, statut: 1 });

// Méthodes statiques
livreSchema.statics.STATUTS = STATUTS;

// Pre-save middleware
livreSchema.pre('save', function(next) {
  if (this.isModified('statut') && this.statut === STATUTS.PUBLISHED) {
    this.datePublication = new Date();
  }
  this.dateMiseAJour = new Date();
  next();
});

// Methods
livreSchema.methods.updateNote = async function() {
  const Commentaire = mongoose.model('Commentaire');
  const stats = await Commentaire.aggregate([
    { $match: { livreId: this._id } },
    {
      $group: {
        _id: null,
        noteMoyenne: { $avg: '$note' },
        nombreNotes: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.noteMoyenne = stats[0].noteMoyenne;
    this.nombreNotes = stats[0].nombreNotes;
    await this.save();
  }
  return this;
};

livreSchema.methods.hideBook = async function(motif) {
  this.statut = STATUTS.HIDDEN;
  this.motifHidden = motif;
  return this.save();
};

livreSchema.methods.publish = async function() {
  this.statut = STATUTS.PUBLISHED;
  this.datePublication = new Date();
  this.motifHidden = undefined;
  return this.save();
};

module.exports = mongoose.model('Livre', livreSchema);
