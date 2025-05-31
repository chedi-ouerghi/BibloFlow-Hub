const router = require('express').Router();
const controller = require('../controllers/auteur.controller');
const { authJwt } = require('../middleware');

// Middleware pour vérifier que l'utilisateur est un auteur
const auteurMiddleware = [authJwt.verifyToken, authJwt.isAuteur];

// Routes pour les livres d'auteur
router.post('/auteur/livres', auteurMiddleware, controller.publierLivre);
router.get('/auteur/livres', auteurMiddleware, controller.getMesLivres);
router.put('/auteur/livres/:id', auteurMiddleware, controller.updateMonLivre);
router.delete('/auteur/livres/:id', auteurMiddleware, controller.demanderSuppressionLivre);

// Routes pour les emprunts
router.get('/auteur/emprunts', auteurMiddleware, controller.getEmpruntsMesLivres);

// Routes pour les analyses
router.get('/auteur/analyses', auteurMiddleware, controller.getAnalysesMesLivres);

// Routes pour les lecteurs
router.get('/auteur/lecteurs', auteurMiddleware, controller.getLecteursMesLivres);

module.exports = router;