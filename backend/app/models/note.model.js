const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
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
  note: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [1, 'La note minimale est 1'],
    max: [5, 'La note maximale est 5'],
    validate: {
      validator: Number.isInteger,
      message: 'La note doit être un nombre entier'
    }
  }
}, {
  timestamps: true
});

// Index unique pour s'assurer qu'un utilisateur ne peut noter qu'une fois
noteSchema.index({ livreId: 1, userId: 1 }, { unique: true });

// Méthode pour mettre à jour les statistiques du livre
noteSchema.post('save', async function() {
  const Livre = mongoose.model('Livre');
  const livre = await Livre.findById(this.livreId);
  if (livre) {
    const stats = await this.constructor.aggregate([
      { $match: { livreId: this.livreId } },
      {
        $group: {
          _id: null,
          noteMoyenne: { $avg: '$note' },
          sommeNotes: { $sum: '$note' },
          nombreNotes: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      livre.noteMoyenne = stats[0].noteMoyenne;
      livre.sommeNotes = stats[0].sommeNotes;
      livre.nombreNotes = stats[0].nombreNotes;
      await livre.save();
    }
  }
});

noteSchema.post('remove', async function() {
  const Livre = mongoose.model('Livre');
  const livre = await Livre.findById(this.livreId);
  if (livre) {
    const stats = await this.constructor.aggregate([
      { $match: { livreId: this.livreId } },
      {
        $group: {
          _id: null,
          noteMoyenne: { $avg: '$note' },
          sommeNotes: { $sum: '$note' },
          nombreNotes: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      livre.noteMoyenne = stats[0].noteMoyenne;
      livre.sommeNotes = stats[0].sommeNotes;
      livre.nombreNotes = stats[0].nombreNotes;
    } else {
      livre.noteMoyenne = 0;
      livre.sommeNotes = 0;
      livre.nombreNotes = 0;
    }
    await livre.save();
  }
});

module.exports = mongoose.model("Note", noteSchema);