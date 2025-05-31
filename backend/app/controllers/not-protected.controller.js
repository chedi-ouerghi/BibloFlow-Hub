const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.User;

// Inscription
exports.signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    
    // Validation du mot de passe
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: "Le mot de passe doit contenir au moins 6 caractères" 
      });
    }
    
    // Hash du mot de passe
    const passwordHash = bcrypt.hashSync(password, 8);
    
    // Création du nouvel utilisateur
    const user = new User({
      username,
      email,
      passwordHash,
      roles: roles || ['user'],
      emailVerified: false,
      isActive: true,
      status: 'active', // Statut actif par défaut pour les utilisateurs normaux
      lastLogin: new Date()
    });

    // Sauvegarde de l'utilisateur
    await user.save();
    
    res.status(201).json({
      message: "Utilisateur créé avec succès!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        status: user.status
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

// Inscription Auteur
exports.signupAuteur = async (req, res) => {
  try {
    const { username, email, password, nom, nationalite, bio } = req.body;
    
    // Validation du mot de passe
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: "Le mot de passe doit contenir au moins 6 caractères" 
      });
    }
    
    // Hash du mot de passe
    const passwordHash = bcrypt.hashSync(password, 8);
    
    // Création du nouvel utilisateur avec statut en attente
    const user = new User({
      username,
      email,
      passwordHash,
      roles: ['auteur'],
      emailVerified: false,
      isActive: false, // L'utilisateur est inactif jusqu'à validation
      lastLogin: new Date(),
      status: 'pending' // Ajouter un statut pending
    });

    // Création de l'auteur avec statut en attente
    const Auteur = require('../models/auteur.model');
    const auteur = new Auteur({
      nom,
      nationalite,
      bio,
      userId: user._id,
      isValidated: false, // En attente de validation
      status: 'pending'
    });

    await user.save();
    await auteur.save();
    
    res.status(201).json({
      message: "Votre demande d'inscription en tant qu'auteur a été prise en compte. Un administrateur examinera votre demande.",
      status: "pending"
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

// Connexion
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "Utilisateur non trouvé." 
      });
    }

    // Vérification du statut de l'utilisateur
    if (user.status === 'pending') {
      return res.status(403).json({ 
        status: "error",
        message: "Votre compte est en attente de validation par un administrateur." 
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ 
        status: "error",
        message: "Votre demande d'inscription a été refusée." 
      });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ 
        status: "error",
        message: "Votre compte a été banni." 
      });
    }

    // Vérification du mot de passe
    const passwordIsValid = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).json({ 
        status: "error",
        message: "Mot de passe invalide!" 
      });
    }

    // Vérification supplémentaire pour les auteurs
    if (user.roles.includes('auteur') && !user.isActive) {
      return res.status(403).json({ 
        status: "error",
        message: "Votre compte auteur est en attente de validation." 
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { 
        id: user._id,
        roles: user.roles 
      },
      config.secret,
      { expiresIn: 86400 } // 24 heures
    );

    // Mise à jour de la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Connexion réussie",
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      status: user.status,
      accessToken: token
    });
  } catch (err) {
    res.status(500).json({ 
      status: "error",
      message: "Une erreur est survenue lors de la connexion" 
    });
  }
};

// Obtenir les informations du profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    const updateData = {};

    if (username) {
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ 
          message: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères" 
        });
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return res.status(400).json({ 
          message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores" 
        });
      }
      updateData.username = username;
    }

    if (email) {
      if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
        return res.status(400).json({ message: "Format d'email invalide" });
      }
      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ 
          message: "Le mot de passe doit contenir au moins 6 caractères" 
        });
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d).*$/.test(password)) {
        return res.status(400).json({ 
          message: "Le mot de passe doit contenir au moins une lettre et un chiffre" 
        });
      }
      updateData.passwordHash = bcrypt.hashSync(password, 8);
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // Vérifier si le nom d'utilisateur ou l'email existe déjà
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.userId } },
          {
            $or: [
              ...(username ? [{ username }] : []),
              ...(email ? [{ email }] : [])
            ]
          }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Ce nom d'utilisateur ou cet email est déjà utilisé"
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user
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

// Obtenir les avertissements de l'utilisateur
exports.getAvertissements = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('avertissements');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.status(200).json(user.avertissements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Marquer un avertissement comme lu
exports.marquerAvertissementLu = async (req, res) => {
  try {
    const { avertissementId } = req.params;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const avertissement = user.avertissements.id(avertissementId);
    if (!avertissement) {
      return res.status(404).json({ message: "Avertissement non trouvé." });
    }

    avertissement.estLu = true;
    await user.save();

    res.status(200).json({ message: "Avertissement marqué comme lu" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};