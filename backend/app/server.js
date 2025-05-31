const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API de la bibliothèque." });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Connexion à MongoDB
require('./config/db');

// Routes
const notProtectedRoutes = require('./routes/not-protected.routes');
const userRoutes = require('./routes/user.routes');
const auteurRoutes = require('./routes/auteur.routes');
const adminRoutes = require('./routes/admin.routes');

// Application des routes avec leur préfixe
app.use('/api', notProtectedRoutes);  // Routes d'authentification et publiques
app.use('/api', userRoutes);          // Routes utilisateur
app.use('/api', auteurRoutes);        // Routes auteur
app.use('/api', adminRoutes);         // Routes admin

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Export de l'app pour les tests
module.exports = app;

// Démarrage du serveur seulement si ce n'est pas un test
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });

