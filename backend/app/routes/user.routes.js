const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authJwt } = require('../middleware');

// Routes des livres
router.get('/livres', controller.getAllLivres);
router.get('/livres/recommandes', controller.getLivresRecommandes);
router.get('/livres/:id/similar', controller.getSimilarBooks);  // Placer avant la route générique
router.get('/livres/:id', controller.getLivreDetails);

// Routes des catégories et auteurs
router.get('/categories', controller.getCategories);
router.get('/auteurs', controller.getAuteurs);

// Routes des emprunts
router.post('/emprunts/:livreId', [authJwt.verifyToken], controller.emprunterLivre);
router.get('/mes-emprunts', [authJwt.verifyToken], controller.getMesEmprunts);
router.get('/me/emprunts/:livreId/verification', [authJwt.verifyToken], controller.verifierEmpruntExistant);

// Routes des commentaires
router.post('/livres/:id/commentaires', [authJwt.verifyToken], controller.addCommentaire);
router.put('/livres/:id/commentaires/:commentId', [authJwt.verifyToken], controller.updateCommentaire);
router.delete('/livres/:id/commentaires/:commentId', [authJwt.verifyToken], controller.deleteCommentaire);
router.get('/livres/:id/commentaires', controller.getLivreCommentaires);
router.get('/users/:id/commentaires', [authJwt.verifyToken], controller.getUserCommentaires);

// Routes des notes
router.post('/livres/:id/note', [authJwt.verifyToken], controller.addNote);
router.put('/livres/:id/note', [authJwt.verifyToken], controller.updateNote);
router.get('/livres/:id/note', [authJwt.verifyToken], controller.getUserNote);

// Routes des avertissements
router.get('/me/avertissements', [authJwt.verifyToken], controller.getAvertissements);
router.put('/me/avertissements/:id/lu', [authJwt.verifyToken], controller.marquerAvertissementLu);



router.get('/livres/recommandations', [authJwt.verifyToken], controller.getRecommandations);
    
module.exports = router;