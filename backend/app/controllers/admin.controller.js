const db = require('../models');
const { Livre, CategorieLivre, Auteur } = db;

// Gestion des livres
exports.createLivre = async (req, res) => {
  try {
    const { titre, description, isbn, couvertureUrl, categories, auteur, langue, nombrePages } = req.body;

    let auteurId = auteur;
    let auteurExistant;

    // Si l'auteur est un objet (nouveau) plutôt qu'un ID
    if (typeof auteur === 'object' && auteur !== null) {
      // Créer un nouvel auteur
      try {
        auteurExistant = await Auteur.create({
          nom: auteur.nom,
          nationalite: auteur.nationalite || "Non spécifiée",
          bio: auteur.bio || "",
          status: 'active',
          isValidated: true
        });
        auteurId = auteurExistant._id;
      } catch (error) {
        return res.status(400).json({ 
          message: "Erreur lors de la création de l'auteur", 
          error: error.message 
        });
      }
    } else {
      // Vérifier si l'auteur existe déjà
      auteurExistant = await Auteur.findById(auteurId);
      if (!auteurExistant) {
        return res.status(404).json({ message: "Auteur non trouvé" });
      }
    }

    // 2. Vérifier les catégories
    const categoriesIds = await Promise.all(categories.map(async (cat) => {
      const categorie = await CategorieLivre.findById(cat);
      if (!categorie) {
        throw new Error(`Catégorie ${cat} non trouvée`);
      }
      return cat;
    }));

    // 3. Créer le livre avec les informations complètes
    const livre = await Livre.create({
      titre,
      description,
      isbn,
      couvertureUrl,
      langue,
      nombrePages: parseInt(nombrePages, 10),
      categories: categoriesIds,
      auteur: auteurId,
      nomAuteur: auteurExistant.nom,
      nationaliteAuteur: auteurExistant.nationalite,
      bioAuteur: auteurExistant.bio,
      statut: req.body.statut || 'draft'
    });

    // 4. Retourner le livre avec ses relations
    const livreComplet = await livre.populate(['categories', 'auteur']);

    res.status(201).json({
      message: "Livre créé avec succès",
      livre: livreComplet
    });
  } catch (err) {
    console.error('Erreur création livre:', err);
    res.status(500).json({ 
      message: "Erreur lors de la création du livre",
      error: err.message 
    });
  }
};

// Récupération de tous les livres
exports.getAllLivres = async (req, res) => {
  try {
    const livres = await Livre.find()
      .populate('auteur')
      .populate('categories')
      .sort('-dateCreation');

    res.status(200).json(livres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupération d'un livre par ID
exports.getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id)
      .populate('auteur')
      .populate('categories');

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json(livre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mise à jour complète d'un livre
exports.updateLivre = async (req, res) => {
  try {
    const { titre, description, isbn, couvertureUrl, categories, auteur, statut, langue, nombrePages } = req.body;

    // Validation des catégories
    const categoriesIds = await Promise.all(categories.map(async (cat) => {
      const categorie = await CategorieLivre.findById(cat);
      if (!categorie) throw new Error(`Catégorie ${cat} non trouvée`);
      return cat;
    }));

    // Validation de l'auteur
    const auteurExist = await Auteur.findById(auteur);
    if (!auteurExist) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    const livre = await Livre.findByIdAndUpdate(
      req.params.id,
      {
        titre,
        description,
        isbn,
        couvertureUrl,
        langue,
        nombrePages: parseInt(nombrePages, 10),
        categories: categoriesIds,
        auteur,
        statut: statut || 'draft'
      },
      { new: true }
    ).populate(['categories', 'auteur']);

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json({
      message: "Livre mis à jour avec succès",
      livre
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mise à jour du statut d'un livre
exports.updateLivreStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const livre = await Livre.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    ).populate(['categories', 'auteur']);

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json({
      message: "Statut du livre mis à jour avec succès",
      livre
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suppression d'un livre
exports.deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);
    
    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json({ message: "Livre supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des auteurs
exports.createAuteur = async (req, res) => {
  try {
    const auteur = await Auteur.create(req.body);
    res.status(201).json({
      message: "Auteur créé avec succès",
      auteur
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAuteurs = async (req, res) => {
  try {
    const auteurs = await Auteur.find().sort('nom');
    res.status(200).json(auteurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAuteurById = async (req, res) => {
  try {
    const auteur = await Auteur.findById(req.params.id)
      .populate({
        path: 'livres',
        populate: { path: 'categories' }
      });

    if (!auteur) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    res.status(200).json(auteur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAuteur = async (req, res) => {
  try {
    const auteur = await Auteur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!auteur) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    res.status(200).json({
      message: "Auteur mis à jour avec succès",
      auteur
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAuteur = async (req, res) => {
  try {
    const auteur = await Auteur.findById(req.params.id);
    
    if (!auteur) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    // Vérifier si l'auteur a des livres
    const livresCount = await Livre.countDocuments({ auteur: req.params.id });
    if (livresCount > 0) {
      return res.status(400).json({ 
        message: "Impossible de supprimer l'auteur car il a des livres associés" 
      });
    }

    await Auteur.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Auteur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des catégories
exports.createCategorie = async (req, res) => {
  try {
    const categorie = await CategorieLivre.create(req.body);
    res.status(201).json({
      message: "Catégorie créée avec succès",
      categorie
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategorieLivre.find()
      .populate('parent')
      .sort('ordre');
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategorieById = async (req, res) => {
  try {
    const categorie = await CategorieLivre.findById(req.params.id)
      .populate('parent')
      .populate('sousCategories');

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json(categorie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategorie = async (req, res) => {
  try {
    const categorie = await CategorieLivre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate(['parent', 'sousCategories']);

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json({
      message: "Catégorie mise à jour avec succès",
      categorie
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategorie = async (req, res) => {
  try {
    const categorie = await CategorieLivre.findById(req.params.id);
    
    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Vérifier si la catégorie a des sous-catégories
    const sousCategories = await CategorieLivre.countDocuments({ parent: req.params.id });
    if (sousCategories > 0) {
      return res.status(400).json({ 
        message: "Impossible de supprimer la catégorie car elle a des sous-catégories" 
      });
    }

    // Vérifier si la catégorie est utilisée par des livres
    const livresCount = await Livre.countDocuments({ categories: req.params.id });
    if (livresCount > 0) {
      return res.status(400).json({ 
        message: "Impossible de supprimer la catégorie car elle est utilisée par des livres" 
      });
    }

    await categorie.remove();
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.find({ 
      status: 'active'  // Ne récupérer que les utilisateurs actifs
    })
      .select('-passwordHash')
      .sort('-createdAt');
    
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAvertissement = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Le message d'avertissement est requis" });
    }

    const user = await db.User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.ajouterAvertissement(message, req.userId);

    res.status(200).json({
      message: "Avertissement ajouté avec succès",
      user: {
        ...user.toJSON(),
        nombreAvertissements: user.nombreAvertissements
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des commentaires
exports.getAllCommentaires = async (req, res) => {
  try {
    const commentaires = await db.Commentaire.find()
      .populate({
        path: 'livreId',
        select: 'titre'
      })
      .populate({
        path: 'userId',
        select: 'username'
      })
      .populate({
        path: 'moderateurId',
        select: 'username'
      })
      .sort('-createdAt');
    
    res.status(200).json(commentaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.moderateCommentaire = async (req, res) => {
  try {
    const { estVisible, motif } = req.body;
    const commentaire = await db.Commentaire.findById(req.params.id);
    
    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    await commentaire.moderer(req.userId, estVisible, motif);
    
    const commentairePopulated = await db.Commentaire.findById(commentaire._id)
      .populate({
        path: 'livreId',
        select: 'titre'
      })
      .populate({
        path: 'userId',
        select: 'username'
      })
      .populate({
        path: 'moderateurId',
        select: 'username'
      });

    res.status(200).json({
      message: "Commentaire modéré avec succès",
      commentaire: commentairePopulated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gestion des emprunts
exports.getAllEmprunts = async (req, res) => {
  try {
    const { statut, search, page = 1, limit = 10 } = req.query;
    let query = {};

    // Filtrer par statut
    if (statut === 'en_cours') {
      query.estRendu = false;
    } else if (statut === 'rendus') {
      query.estRendu = true;
    } else if (statut === 'en_retard') {
      query.estRendu = false;
      query.dateRetourPrevue = { $lt: new Date() };
    }

    // Recherche par utilisateur ou livre
    if (search) {
      const users = await db.User.find({
        username: { $regex: search, $options: 'i' }
      }).select('_id');
      
      const livres = await db.Livre.find({
        titre: { $regex: search, $options: 'i' }
      }).select('_id');
      
      query.$or = [
        { userId: { $in: users.map(u => u._id) } },
        { livreId: { $in: livres.map(l => l._id) } }
      ];
    }

    // Calculer le nombre total pour la pagination
    const total = await db.Emprunt.countDocuments(query);

    // Récupérer les emprunts avec pagination
    const emprunts = await db.Emprunt.find(query)
      .populate('livreId', 'titre isbn couvertureUrl')
      .populate('userId', 'username email')
      .sort('-dateEmprunt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calculer les statistiques
    const stats = await db.Emprunt.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          enCours: {
            $sum: { $cond: [{ $eq: ["$estRendu", false] }, 1, 0] }
          },
          enRetard: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ["$estRendu", false] },
                    { $lt: ["$dateRetourPrevue", new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      emprunts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      statistiques: stats[0] || {
        total: 0,
        enCours: 0,
        enRetard: 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEmprunt = async (req, res) => {
  try {
    const { livreId, userId, dateRetourPrevue } = req.body;

    // Vérifier si le livre existe
    const livre = await db.Livre.findById(livreId);
    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifier si l'utilisateur existe
    const user = await db.User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si le livre n'est pas déjà emprunté
    const empruntExistant = await db.Emprunt.findOne({
      livreId,
      estRendu: false
    });

    if (empruntExistant) {
      return res.status(400).json({ 
        message: "Ce livre est déjà emprunté" 
      });
    }

    const nouvelEmprunt = await db.Emprunt.create({
      livreId,
      userId,
      dateRetourPrevue,
      etat: 'en_cours'
    });

    const empruntPopulated = await db.Emprunt.findById(nouvelEmprunt._id)
      .populate('livreId', 'titre isbn')
      .populate('userId', 'username email');

    res.status(201).json({
      message: "Emprunt créé avec succès",
      emprunt: empruntPopulated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.marquerEmpruntRendu = async (req, res) => {
  try {
    const emprunt = await db.Emprunt.findById(req.params.id);
    if (!emprunt) {
      return res.status(404).json({ message: "Emprunt non trouvé" });
    }

    if (emprunt.estRendu) {
      return res.status(400).json({ message: "Cet emprunt est déjà marqué comme rendu" });
    }

    emprunt.estRendu = true;
    emprunt.dateRetourEffective = new Date();
    emprunt.etat = 'rendu';
    await emprunt.save();

    const empruntPopulated = await db.Emprunt.findById(emprunt._id)
      .populate('livreId', 'titre isbn')
      .populate('userId', 'username email');

    res.status(200).json({
      message: "Emprunt marqué comme rendu avec succès",
      emprunt: empruntPopulated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEmprunt = async (req, res) => {
  try {
    const { dateRetourPrevue, commentaires } = req.body;
    const emprunt = await db.Emprunt.findById(req.params.id);
    
    if (!emprunt) {
      return res.status(404).json({ message: "Emprunt non trouvé" });
    }

    // Mise à jour des champs modifiables
    if (dateRetourPrevue) emprunt.dateRetourPrevue = dateRetourPrevue;
    if (commentaires) {
      if (commentaires.etatLivreDepart) emprunt.commentaires.etatLivreDepart = commentaires.etatLivreDepart;
      if (commentaires.etatLivreRetour) emprunt.commentaires.etatLivreRetour = commentaires.etatLivreRetour;
    }

    await emprunt.save();

    const empruntPopulated = await db.Emprunt.findById(emprunt._id)
      .populate('livreId', 'titre isbn')
      .populate('userId', 'username email');

    res.status(200).json({
      message: "Emprunt mis à jour avec succès",
      emprunt: empruntPopulated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEmpruntStatut = async (req, res) => {
  try {
    const { etat } = req.body;
    const emprunt = await db.Emprunt.findById(req.params.id);

    if (!emprunt) {
      return res.status(404).json({ message: "Emprunt non trouvé" });
    }

    // Vérifier que le statut est valide
    if (!['en_cours', 'en_retard', 'rendu'].includes(etat)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Mise à jour du statut et des champs associés
    emprunt.etat = etat;
    if (etat === 'rendu') {
      emprunt.estRendu = true;
      emprunt.dateRetourEffective = new Date();
    } else {
      emprunt.estRendu = false;
      emprunt.dateRetourEffective = null;
    }

    await emprunt.save();

    const empruntPopulated = await db.Emprunt.findById(emprunt._id)
      .populate('livreId', 'titre isbn')
      .populate('userId', 'username email');

    res.status(200).json({
      message: "Statut de l'emprunt mis à jour avec succès",
      emprunt: empruntPopulated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Création d'un auteur (uniquement par l'admin)
exports.createAuteurUser = async (req, res) => {
  try {
    const { username, email, password, nom, nationalite, bio } = req.body;
    
    // Validation du mot de passe
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: "Le mot de passe doit contenir au moins 6 caractères" 
      });
    }
    
    // Hash du mot de passe
    const bcrypt = require('bcryptjs');
    const passwordHash = bcrypt.hashSync(password, 8);
    
    // Création de l'utilisateur
    const user = new db.User({
      username,
      email,
      passwordHash,
      roles: ['auteur'],
      emailVerified: true, // L'admin vérifie directement
      isActive: true,
      lastLogin: new Date()
    });

    // Création de l'auteur
    const auteur = new db.Auteur({
      nom,
      nationalite,
      bio,
      userId: user._id
    });

    // Sauvegarde de l'utilisateur et de l'auteur
    await user.save();
    await auteur.save();
    
    res.status(201).json({
      message: "Compte auteur créé avec succès par l'administrateur",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        auteur: {
          id: auteur._id,
          nom: auteur.nom,
          nationalite: auteur.nationalite,
          bio: auteur.bio
        }
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les auteurs en attente de validation
exports.getPendingAuteurs = async (req, res) => {
  try {
    // Rechercher les auteurs en attente avec leurs informations utilisateur
    const auteurs = await db.Auteur.find({ 
      status: 'pending',
      isValidated: false 
    }).populate({
      path: 'userId',
      select: 'username email status',
      match: { status: 'pending' } // S'assurer que l'utilisateur est aussi en attente
    });

    // Filtrer les auteurs qui ont un utilisateur valide
    const auteursValides = auteurs.filter(auteur => auteur.userId);

    console.log(`Trouvé ${auteursValides.length} auteurs en attente`); // Debug log

    res.status(200).json(auteursValides);
  } catch (err) {
    console.error('Erreur getPendingAuteurs:', err);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des auteurs en attente",
      error: err.message 
    });
  }
};

exports.validateAuteur = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValidated } = req.body;

    const auteur = await db.Auteur.findById(id);
    if (!auteur) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }

    const user = await db.User.findById(auteur.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (isValidated) {
      // Si validé, mettre à jour les statuts
      auteur.isValidated = true;
      auteur.status = 'active';
      user.isActive = true;
      user.emailVerified = true;
      user.status = 'active';

      await auteur.save();
      await user.save();

      res.status(200).json({
        message: "Compte auteur validé avec succès",
        auteur: {
          ...auteur.toJSON(),
          user: {
            username: user.username,
            email: user.email
          }
        }
      });
    } else {
      // Si rejeté, supprimer l'auteur et l'utilisateur
      await db.Auteur.deleteOne({ _id: id });
      await db.User.deleteOne({ _id: auteur.userId });

      res.status(200).json({
        message: "Demande d'inscription auteur rejetée et supprimée",
        status: 'rejected'
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};