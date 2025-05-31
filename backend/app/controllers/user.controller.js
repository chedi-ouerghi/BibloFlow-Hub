const db = require('../models');
const { Livre, Commentaire, CategorieLivre, User, Note, Emprunt } = db;

// Récupération des livres publiés
exports.getAllLivres = async (req, res) => {
  try {
    const { search, categorie, page = 1, limit = 10 } = req.query;
    const query = { statut: 'published' };

    if (search) {
      query.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (categorie) {
      query.categories = categorie;
    }

    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { datePublication: -1 }
    };

    const [livres, total] = await Promise.all([
      Livre.find(query, null, options)
        .populate('auteur', 'nom photo')
        .populate('categories', 'nom')
        .populate({
          path: 'commentaires',
          match: { estVisible: true },
          select: 'note contenu userId createdAt',
          populate: { path: 'userId', select: 'username' }
        })
        .lean(),  // Convertir en objet JavaScript simple
      Livre.countDocuments(query)
    ]);

    // S'assurer que les commentaires existent pour chaque livre
    const livresAvecCommentaires = livres.map(livre => ({
      ...livre,
      commentaires: livre.commentaires || [],
      nombreCommentaires: (livre.commentaires || []).length
    }));

    res.status(200).json({
      livres: livresAvecCommentaires,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Détails d'un livre
exports.getLivreDetails = async (req, res) => {
  try {
    const livre = await Livre.findOne({
      _id: req.params.id,
      statut: 'published'
    })
    .populate('auteur')
    .populate('categories')
    .populate({
      path: 'commentaires',
      match: { estVisible: true },
      populate: { path: 'userId', select: 'username' }
    })
    .lean();  // Convertir en objet JavaScript simple

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // S'assurer que les commentaires existent
    livre.commentaires = livre.commentaires || [];
    livre.nombreCommentaires = livre.commentaires.length;

    res.status(200).json(livre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupération des catégories
exports.getCategories = async (req, res) => {
  try {
    const categories = await CategorieLivre.find({ estActive: true })
      .select('nom description icon couleur')
      .sort('nom');

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupération des auteurs
exports.getAuteurs = async (req, res) => {
  try {
    const auteurs = await db.Auteur.find({ estActif: true })
      .select('nom photo bio')
      .sort('nom');

    res.status(200).json(auteurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajout d'une note
exports.addNote = async (req, res) => {
  try {
    const { note } = req.body;
    const livre = await Livre.findOne({
      _id: req.params.id,
      statut: 'published'
    });

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    const existingNote = await Note.findOne({
      livreId: livre._id,
      userId: req.userId
    });

    if (existingNote) {
      return res.status(400).json({
        message: "Vous avez déjà noté ce livre"
      });
    }

    const newNote = new Note({
      livreId: livre._id,
      userId: req.userId,
      note
    });

    await newNote.save();

    const updatedLivre = await Livre.findById(livre._id);

    res.status(201).json({
      message: "Note ajoutée avec succès",
      note: newNote.note,
      noteMoyenne: updatedLivre.noteMoyenne,
      nombreNotes: updatedLivre.nombreNotes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mise à jour d'une note
exports.updateNote = async (req, res) => {
  try {
    const { note } = req.body;
    const livre = await Livre.findOne({
      _id: req.params.id,
      statut: 'published'
    });

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const existingNote = await Note.findOne({
      livreId: livre._id,
      userId: req.userId
    });

    if (!existingNote) {
      return res.status(404).json({
        message: "Note non trouvée"
      });
    }

    existingNote.note = note;
    await existingNote.save();

    const updatedLivre = await Livre.findById(livre._id);

    res.status(200).json({
      message: "Note mise à jour avec succès",
      note: existingNote.note,
      noteMoyenne: updatedLivre.noteMoyenne,
      nombreNotes: updatedLivre.nombreNotes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupération de la note d'un utilisateur pour un livre
exports.getUserNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      livreId: req.params.id,
      userId: req.userId
    }).select('note');

    res.status(200).json({ note: note ? note.note : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajout d'un commentaire
exports.addCommentaire = async (req, res) => {
  try {
    const { contenu } = req.body;
    const livre = await Livre.findOne({
      _id: req.params.id,
      statut: 'published'
    });

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifier si l'utilisateur a déjà commenté ce livre
    const commentaireExistant = await Commentaire.findOne({
      livreId: livre._id,
      userId: req.userId
    });

    if (commentaireExistant) {
      return res.status(400).json({
        message: "Vous avez déjà commenté ce livre"
      });
    }

    const commentaire = new Commentaire({
      livreId: livre._id,
      userId: req.userId,
      contenu
    });

    await commentaire.save();

    // Mettre à jour le nombre de commentaires du livre
    livre.nombreCommentaires = await Commentaire.countDocuments({
      livreId: livre._id,
      estVisible: true
    });
    await livre.save();

    // Retourner le commentaire avec les informations de l'utilisateur
    const commentairePopulated = await commentaire.populate('userId', 'username');

    res.status(201).json({
      message: "Commentaire ajouté avec succès",
      commentaire: commentairePopulated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mise à jour d'un commentaire
exports.updateCommentaire = async (req, res) => {
  try {
    const { contenu } = req.body;
    const commentaire = await Commentaire.findOne({
      _id: req.params.commentId,
      livreId: req.params.id,
      userId: req.userId
    });

    if (!commentaire) {
      return res.status(404).json({
        message: "Commentaire non trouvé ou vous n'êtes pas autorisé à le modifier"
      });
    }

    commentaire.contenu = contenu;
    await commentaire.save();

    res.status(200).json({
      message: "Commentaire mis à jour avec succès",
      commentaire: await commentaire.populate('userId', 'username')
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suppression d'un commentaire
exports.deleteCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findOne({
      _id: req.params.commentId,
      livreId: req.params.id,
      userId: req.userId
    });

    if (!commentaire) {
      return res.status(404).json({
        message: "Commentaire non trouvé ou vous n'êtes pas autorisé à le supprimer"
      });
    }

    await commentaire.remove();

    // Mettre à jour le nombre de commentaires du livre
    const livre = await Livre.findById(req.params.id);
    if (livre) {
      livre.nombreCommentaires = await Commentaire.countDocuments({
        livreId: livre._id,
        estVisible: true
      });
      await livre.save();
    }

    res.status(200).json({
      message: "Commentaire supprimé avec succès"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupération des commentaires d'un livre
exports.getLivreCommentaires = async (req, res) => {
  try {
    const livre = await Livre.findOne({
      _id: req.params.id,
      statut: 'published'
    });

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const commentaires = await Commentaire.find({
      livreId: livre._id,
      estVisible: true
    })
    .populate({
      path: 'userId',
      select: 'username email avatar'
    })
    .sort('-createdAt')
    .lean();

    res.status(200).json(commentaires || []);
  } catch (err) {
    console.error('Error in getLivreCommentaires:', err);
    res.status(500).json({ message: err.message });
  }
};

// Récupération des commentaires d'un utilisateur
exports.getUserCommentaires = async (req, res) => {
  try {
    if (req.params.id !== req.userId && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à voir les commentaires de cet utilisateur"
      });
    }

    const commentaires = await Commentaire.find({
      userId: req.params.id,
      estVisible: true
    })
    .populate('livreId', 'titre')
    .sort('-createdAt');

    res.status(200).json(commentaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupération des avertissements
exports.getAvertissements = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user.avertissements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Marquer un avertissement comme lu
exports.marquerAvertissementLu = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const avertissement = user.avertissements.id(req.params.id);
    if (!avertissement) {
      return res.status(404).json({ message: "Avertissement non trouvé" });
    }

    avertissement.estLu = true;
    await user.save();

    res.status(200).json({
      message: "Avertissement marqué comme lu",
      avertissements: user.avertissements
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Emprunter un livre
exports.emprunterLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.livreId);
    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifier si l'utilisateur a déjà un emprunt en cours pour ce livre
    const empruntExistant = await Emprunt.findOne({
      livreId: livre._id,
      userId: req.userId,
      estRendu: false
    });

    if (empruntExistant) {
      return res.status(400).json({
        message: "Vous avez déjà emprunté ce livre"
      });
    }

    // Vérifier si le livre est disponible
    const empruntsEnCours = await Emprunt.countDocuments({
      livreId: livre._id,
      estRendu: false
    });

    if (empruntsEnCours >= livre.nombreExemplaires) {
      return res.status(400).json({
        message: "Désolé, ce livre n'est pas disponible pour le moment"
      });
    }

    // Créer l'emprunt
    const dateRetourPrevue = new Date();
    dateRetourPrevue.setDate(dateRetourPrevue.getDate() + 14); // 14 jours d'emprunt

    const emprunt = new Emprunt({
      livreId: livre._id,
      userId: req.userId,
      dateRetourPrevue,
      commentaires: {
        etatLivreDepart: req.body.etatLivreDepart
      }
    });

    await emprunt.save();

    // Retourner l'emprunt avec les détails du livre
    const empruntPopulated = await emprunt.populate([
      { path: 'livreId', select: 'titre isbn couvertureUrl' },
      { path: 'userId', select: 'username' }
    ]);

    res.status(201).json({
      message: "Livre emprunté avec succès",
      emprunt: empruntPopulated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Vérifier un emprunt existant
exports.verifierEmpruntExistant = async (req, res) => {
  try {
    const livreId = req.params.livreId;
    const userId = req.userId;

    // Vérifier les emprunts en cours
    const empruntExistant = await Emprunt.findOne({
      livreId: livreId,
      userId: userId,
      estRendu: false
    });

    if (empruntExistant) {
      const today = new Date();
      const dateRetour = new Date(empruntExistant.dateRetourPrevue);
      const diffTime = dateRetour.getTime() - today.getTime();
      const joursRestants = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return res.status(200).json({
        empruntExistant: true,
        etat: 'en_cours',
        dateRetourPrevue: empruntExistant.dateRetourPrevue,
        joursRestants: joursRestants
      });
    }

    return res.status(200).json({
      empruntExistant: false
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la vérification de l'emprunt."
    });
  }
};

// Obtenir mes emprunts
exports.getMesEmprunts = async (req, res) => {
  try {
    const { statut } = req.query;
    const query = { userId: req.userId };

    if (statut === 'en_cours') {
      query.estRendu = false;
    } else if (statut === 'rendus') {
      query.estRendu = true;
    }

    const emprunts = await Emprunt.find(query)
      .populate('livreId', 'titre isbn couvertureUrl')
      .sort('-dateEmprunt');

    res.status(200).json(emprunts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupération des livres recommandés
exports.getLivresRecommandes = async (req, res) => {
  try {
    const livres = await Livre.find({
      statut: 'published',
      noteMoyenne: { $gte: 4.5 }
    })
    .populate('auteur')
    .populate('categories')
    .populate({
      path: 'commentaires',
      match: { estVisible: true },
      select: 'note contenu userId createdAt',
      populate: { path: 'userId', select: 'username' }
    })
    .sort('-noteMoyenne')
    .lean();

    // S'assurer que les commentaires existent pour chaque livre
    const livresAvecCommentaires = livres.map(livre => ({
      ...livre,
      commentaires: livre.commentaires || [],
      nombreCommentaires: (livre.commentaires || []).length
    }));

    res.status(200).json(livresAvecCommentaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommandations = async (req, res) => {
    try {
        const userId = req.userId; // Récupéré via authJwt
        const emprunts = await Emprunt.find({ userId }); // Récupérer les emprunts
        const notes = await Note.find({ userId }); // Récupérer les notes
        const commentaires = await Commentaire.find({ userId }); // Récupérer les commentaires

        // Appel à une API d'IA ou un modèle local
        const recommandations = await iaService.getRecommandations({
            emprunts,
            notes,
            commentaires
        });

        res.status(200).json(recommandations);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la génération des recommandations", error });
    }
};
