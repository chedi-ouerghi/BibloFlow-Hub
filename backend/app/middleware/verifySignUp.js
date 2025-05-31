const db = require("../models");
const User = db.User;
const config = require('../config/auth.config');

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validation du format du nom d'utilisateur
    if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({ 
        message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores" 
      });
    }

    // Validation de la longueur du nom d'utilisateur
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ 
        message: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères" 
      });
    }

    // Validation du format de l'email
    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      return res.status(400).json({ 
        message: "Format d'email invalide" 
      });
    }

    // Username check
    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ 
        message: "Ce nom d'utilisateur est déjà utilisé" 
      });
    }

    // Email check
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ 
        message: "Cette adresse email est déjà utilisée" 
      });
    }

    // Validation de la longueur du mot de passe
    if (!password || password.length < config.passwordMinLength) {
      return res.status(400).json({
        message: `Le mot de passe doit contenir au moins ${config.passwordMinLength} caractères`
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ 
      message: "Une erreur est survenue lors de la vérification des informations"
    });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;