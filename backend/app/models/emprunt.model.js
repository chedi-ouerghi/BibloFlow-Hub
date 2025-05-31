const mongoose = require("mongoose");
const { Schema } = mongoose;

const ETATS = {
  EN_COURS: 'en_cours',
  RENDU: 'rendu',
  EN_RETARD: 'en_retard'
};

const empruntSchema = new Schema({
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
  dateEmprunt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  dateRetourPrevue: {
    type: Date,
    required: [true, 'La date de retour prévue est requise'],
    validate: {
      validator: function(date) {
        return date > this.dateEmprunt;
      },
      message: 'La date de retour prévue doit être postérieure à la date d\'emprunt'
    }
  },
  dateRetourEffective: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date >= this.dateEmprunt;
      },
      message: 'La date de retour effective ne peut pas être antérieure à la date d\'emprunt'
    }
  },
  estRendu: {
    type: Boolean,
    default: false
  },
  etat: {
    type: String,
    enum: Object.values(ETATS),
    default: ETATS.EN_COURS,
    required: true
  },
  commentaires: {
    etatLivreDepart: {
      type: String,
      trim: true,
      maxlength: [200, 'Le commentaire sur l\'état de départ ne doit pas dépasser 200 caractères']
    },
    etatLivreRetour: {
      type: String,
      trim: true,
      maxlength: [200, 'Le commentaire sur l\'état de retour ne doit pas dépasser 200 caractères']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
empruntSchema.index({ dateRetourPrevue: 1, estRendu: 1 });
empruntSchema.index({ userId: 1, estRendu: 1 });
empruntSchema.index({ livreId: 1, estRendu: 1 });

// Virtuals
empruntSchema.virtual('dureeRetard').get(function() {
  if (!this.estRendu && this.estEnRetard()) {
    return Math.ceil((new Date() - this.dateRetourPrevue) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Methods
empruntSchema.methods.estEnRetard = function() {
  if (this.estRendu) return false;
  return new Date() > this.dateRetourPrevue;
};

empruntSchema.methods.rendre = function(commentaireRetour) {
  this.estRendu = true;
  this.dateRetourEffective = new Date();
  this.etat = ETATS.RENDU;
  if (commentaireRetour) {
    this.commentaires.etatLivreRetour = commentaireRetour;
  }
  return this.save();
};

empruntSchema.methods.prolonger = function(joursSupplementaires) {
  if (this.estRendu || this.estEnRetard()) {
    throw new Error('Impossible de prolonger cet emprunt');
  }
  
  const nouvelleDate = new Date(this.dateRetourPrevue);
  nouvelleDate.setDate(nouvelleDate.getDate() + joursSupplementaires);
  this.dateRetourPrevue = nouvelleDate;
  
  return this.save();
};

// Pre-save middleware
empruntSchema.pre('save', function(next) {
  if (this.estRendu) {
    this.etat = ETATS.RENDU;
  } else if (this.estEnRetard()) {
    this.etat = ETATS.EN_RETARD;
  } else {
    this.etat = ETATS.EN_COURS;
  }
  next();
});

// Statics
empruntSchema.statics.ETATS = ETATS;

module.exports = mongoose.model("Emprunt", empruntSchema);