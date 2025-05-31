const mongoose = require("mongoose");
const { Schema } = mongoose;

const avertissementSchema = new Schema({
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Le message ne doit pas dépasser 500 caractères']
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  estLu: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'],
    unique: true,
    trim: true,
    minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
    maxlength: [20, 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/, 'Format d\'email invalide']
  },
  passwordHash: {
    type: String,
    required: [true, 'Le mot de passe est requis']
  },
  avatar: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'L\'URL de l\'avatar doit être une URL valide'
    }
  },
  roles: {
    type: [String],
    enum: {
      values: ['user', 'admin', 'auteur'],
      message: 'Rôle {VALUE} non valide'
    },
    default: ['user'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'L\'utilisateur doit avoir au moins un rôle'
    }
  },
  avertissements: [avertissementSchema],
  estBanni: {
    type: Boolean,
    default: false
  },
  motifBan: {
    type: String,
    maxlength: [500, 'Le motif de bannissement ne doit pas dépasser 500 caractères']
  },
  dateBan: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  tentativesConnexion: {
    type: Number,
    default: 0
  },
  dateVerrouillage: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
      delete ret.tentativesConnexion;
      delete ret.dateVerrouillage;
      return ret;
    },
    virtuals: true
  }
});

// Virtuals
userSchema.virtual('estVerrouille').get(function() {
  if (!this.dateVerrouillage) return false;
  const DUREE_VERROUILLAGE = 30 * 60 * 1000; // 30 minutes
  return new Date() - this.dateVerrouillage < DUREE_VERROUILLAGE;
});

userSchema.virtual('nombreAvertissements').get(function() {
  return this.avertissements ? this.avertissements.length : 0;
});

userSchema.virtual('avertissementsNonLus').get(function() {
  return this.avertissements ? this.avertissements.filter(a => !a.estLu) : [];
});

// Methods
userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

userSchema.methods.ajouterAvertissement = function(message, adminId) {
  this.avertissements.push({
    message,
    adminId,
    dateCreation: new Date(),
    estLu: false
  });
  return this.save();
};

userSchema.methods.marquerAvertissementsLus = function() {
  this.avertissements.forEach(a => {
    a.estLu = true;
  });
  return this.save();
};

userSchema.methods.bannir = function(motif, adminId) {
  this.estBanni = true;
  this.motifBan = motif;
  this.dateBan = new Date();
  return this.save();
};

userSchema.methods.debannir = function() {
  this.estBanni = false;
  this.motifBan = undefined;
  this.dateBan = undefined;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);