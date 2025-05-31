const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorieLivreSchema = new Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    unique: true,
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne doit pas dépasser 50 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne doit pas dépasser 500 caractères']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true,
    match: [/^[a-zA-Z0-9-_]+$/, 'Format d\'icône invalide']
  },
  couleur: {
    type: String,
    trim: true,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Format de couleur hexadécimal invalide']
  },
  estActive: {
    type: Boolean,
    default: true
  },
  ordre: {
    type: Number,
    default: 0
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'CategorieLivre',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware pour générer le slug
categorieLivreSchema.pre('save', function(next) {
  if (this.isModified('nom')) {
    this.slug = this.nom
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Virtuals
categorieLivreSchema.virtual('livres', {
  ref: 'Livre',
  localField: '_id',
  foreignField: 'categories',
  match: { statut: 'published' }
});

categorieLivreSchema.virtual('sousCategories', {
  ref: 'CategorieLivre',
  localField: '_id',
  foreignField: 'parent'
});

categorieLivreSchema.virtual('livresCount', {
  ref: 'Livre',
  localField: '_id',
  foreignField: 'categories',
  count: true,
  match: { statut: 'published' }
});

// Indexes
categorieLivreSchema.index({ nom: 'text', description: 'text' });
categorieLivreSchema.index({ slug: 1 }, { unique: true });
categorieLivreSchema.index({ parent: 1, ordre: 1 });

// Méthodes statiques
categorieLivreSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), estActive: true });
};

categorieLivreSchema.statics.findMainCategories = function() {
  return this.find({ parent: null, estActive: true })
    .sort({ ordre: 1, nom: 1 })
    .populate('sousCategories');
};

categorieLivreSchema.statics.search = function(terme) {
  return this.find({
    estActive: true,
    $text: { $search: terme }
  }).sort({ score: { $meta: 'textScore' } });
};

// Méthodes d'instance
categorieLivreSchema.methods.updateStatut = function(actif) {
  this.estActive = actif;
  return this.save();
};

module.exports = mongoose.model('CategorieLivre', categorieLivreSchema);