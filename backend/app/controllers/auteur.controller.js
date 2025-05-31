const db = require('../models');
const { Livre, Emprunt, Commentaire, Note, User } = db;

// Gestion des livres
exports.publierLivre = async (req, res) => {
  try {
    const { titre, description, isbn, couvertureUrl, categories, langue, nombrePages } = req.body;

    if (!titre || !description || !isbn || !couvertureUrl || !categories || !langue || !nombrePages) {
      return res.status(400).json({ 
        status: "error",
        message: "Tous les champs sont requis" 
      });
    }

    // Récupérer les informations de l'auteur
    const auteurInfo = await db.Auteur.findOne({ userId: req.user.id });

    if (!auteurInfo) {
      return res.status(404).json({ 
        status: "error",
        message: "Auteur non trouvé" 
      });
    }

    // Vérifier si l'ISBN existe déjà
    const existingBook = await db.Livre.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        status: "error",
        message: "Un livre avec cet ISBN existe déjà"
      });
    }

    // Créer le livre avec les informations de l'auteur
    const nouveauLivre = {
      titre,
      description,
      isbn,
      couvertureUrl,
      langue,
      nombrePages: parseInt(nombrePages, 10),
      categories,
      auteur: auteurInfo._id,
      nomAuteur: auteurInfo.nom,
      nationaliteAuteur: auteurInfo.nationalite || 'Non spécifiée',
      bioAuteur: auteurInfo.bio || '',
      statut: 'draft' // Statut par défaut
    };

    const livre = await db.Livre.create(nouveauLivre);

    // Retourner le livre avec ses relations
    const livreComplet = await livre.populate(['categories', {
      path: 'auteur',
      populate: {
        path: 'userId',
        select: 'username email'
      }
    }]);

    res.status(201).json({
      status: "success",
      message: "Livre créé avec succès (en attente de validation)",
      livre: livreComplet
    });
  } catch (err) {
    console.error('Erreur dans publierLivre:', err);
    res.status(500).json({ 
      status: "error",
      message: "Une erreur est survenue lors de la création du livre",
      error: err.message 
    });
  }
};

exports.getMesLivres = async (req, res) => {
  try {
    const auteurInfo = await db.Auteur.findOne({ userId: req.user.id });

    if (!auteurInfo) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    const livres = await Livre.find({ auteur: auteurInfo._id })
      .populate('categories')
      .populate({
        path: 'auteur',
        populate: {
          path: 'userId',
          select: 'username email'
        }
      })
      .sort('-dateCreation');

    res.status(200).json(livres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMonLivre = async (req, res) => {
  try {
    const auteurInfo = await db.Auteur.findOne({ userId: req.user.id });

    if (!auteurInfo) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    // Vérifier que le livre appartient à l'auteur
    const livre = await Livre.findOne({ 
      _id: req.params.id,
      auteur: auteurInfo._id 
    });

    if (!livre) {
      return res.status(404).json({ 
        message: "Livre non trouvé ou vous n'êtes pas autorisé à le modifier" 
      });
    }

    // Ne permettre que la modification des champs autorisés
    const { titre, description, isbn, couvertureUrl, categories, langue, nombrePages } = req.body;

    // Garder le même statut, l'auteur ne peut pas le modifier
    const livreUpdated = await Livre.findByIdAndUpdate(
      req.params.id,
      {
        titre,
        description,
        isbn,
        couvertureUrl,
        categories,
        langue,
        nombrePages: parseInt(nombrePages, 10)
      },
      { new: true }
    ).populate(['categories', 'auteur']);

    res.status(200).json({
      message: "Livre mis à jour avec succès",
      livre: livreUpdated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.demanderSuppressionLivre = async (req, res) => {
  try {
    const auteurInfo = await db.Auteur.findOne({ userId: req.user.id });

    if (!auteurInfo) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    // Vérifier que le livre appartient à l'auteur
    const livre = await Livre.findOne({ 
      _id: req.params.id,
      auteur: auteurInfo._id 
    });

    if (!livre) {
      return res.status(404).json({ 
        message: "Livre non trouvé ou vous n'êtes pas autorisé à le supprimer" 
      });
    }

    // Marquer le livre comme caché en attendant la validation admin
    livre.statut = 'hidden';
    livre.motifHidden = 'Demande de suppression par l\'auteur';
    await livre.save();

    res.status(200).json({ 
      message: "Demande de suppression envoyée avec succès. Un administrateur examinera votre demande." 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des emprunts
exports.getEmpruntsMesLivres = async (req, res) => {
  try {
    const auteurInfo = await db.Auteur.findOne({ userId: req.user.id });

    if (!auteurInfo) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    const mesLivres = await Livre.find({ auteur: auteurInfo._id });
    const livreIds = mesLivres.map(livre => livre._id);

    const emprunts = await db.Emprunt.find({
      livreId: { $in: livreIds }
    })
    .populate('livreId', 'titre isbn couvertureUrl')
    .populate('userId', 'username email')
    .sort('-dateEmprunt');

    res.status(200).json(emprunts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des analyses
exports.getAnalysesMesLivres = async (req, res) => {
  try {
    const auteurInfo = await db.Auteur.findOne({ userId: req.user.id });

    if (!auteurInfo) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    const mesLivres = await Livre.find({ auteur: auteurInfo._id });
    const livreIds = mesLivres.map(livre => livre._id);

    // Récupération des commentaires
    const commentaires = await db.Commentaire.find({
      livreId: { $in: livreIds },
      estVisible: true
    })
    .populate('livreId', 'titre')
    .populate('userId', 'username')
    .sort('-dateCreation');

    // Récupération des notes
    const notes = await db.Note.find({
      livreId: { $in: livreIds }
    }).populate('livreId', 'titre');

    const analyses = {
      commentaires,
      notes,
      statistiques: {
        totalCommentaires: commentaires.length,
        totalNotes: notes.length,
        moyenneNotes: notes.reduce((acc, note) => acc + note.valeur, 0) / (notes.length || 1)
      }
    };

    res.status(200).json(analyses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des lecteurs
exports.getLecteursMesLivres = async (req, res) => {
  try {
    const auteurInfo = await db.Auteur.findOne({ userId: req.user.id });

    if (!auteurInfo) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    const mesLivres = await Livre.find({ auteur: auteurInfo._id });
    const livreIds = mesLivres.map(livre => livre._id);

    // Récupérer les IDs uniques des lecteurs qui ont emprunté ou commenté
    const empruntLecteurs = await db.Emprunt.distinct('userId', {
      livreId: { $in: livreIds }
    });

    const commentaireLecteurs = await db.Commentaire.distinct('userId', {
      livreId: { $in: livreIds },
      estVisible: true
    });

    // Combiner et dédupliquer les IDs des lecteurs
    const lecteurIds = [...new Set([...empruntLecteurs, ...commentaireLecteurs])];

    // Récupérer les informations des lecteurs
    const lecteurs = await db.User.find(
      { _id: { $in: lecteurIds } },
      'username email'
    ).sort('username');

    res.status(200).json(lecteurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

