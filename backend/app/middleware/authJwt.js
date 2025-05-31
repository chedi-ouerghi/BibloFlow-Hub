const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/user.model");
const { isPublicRoute } = require("./publicRoutes");

const verifyToken = async (req, res, next) => {
  try {
    // Vérifier si c'est une route publique
    if (isPublicRoute(req)) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: "Un token Bearer est requis!" });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.secret);
      req.userId = decoded.id;
      req.user = {
        id: decoded.id,
        roles: decoded.roles
      };
      next();
    } catch (err) {
      return res.status(401).json({ message: "Non autorisé!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user && user.roles.includes("admin")) {
      req.user = {
        id: user._id,
        roles: user.roles
      };
      return next();
    }

    return res.status(403).json({ message: "Requiert le rôle Admin!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const isAuteur = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = user.roles;

    if (roles.includes("auteur")) {
      next();
      return;
    }

    res.status(403).json({
      message: "Accès refusé. Rôle d'auteur requis."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const isAuteurOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user && (user.roles.includes("auteur") || user.roles.includes("admin"))) {
      return next();
    }

    return res.status(403).json({ message: "Requiert le rôle Auteur ou Admin!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isAuteur,
  isAuteurOrAdmin
};

module.exports = authJwt;