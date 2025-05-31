const router = require('express').Router();
const controller = require('../controllers/admin.controller');
const { authJwt } = require('../middleware');

// Middleware pour vérifier que l'utilisateur est un admin
const adminMiddleware = [authJwt.verifyToken, authJwt.isAdmin];

// Routes livres
router.post('/admin/livres', adminMiddleware, controller.createLivre);
router.get('/admin/livres', adminMiddleware, controller.getAllLivres);
router.get('/admin/livres/:id', adminMiddleware, controller.getLivreById);
router.put('/admin/livres/:id', adminMiddleware, controller.updateLivre);
router.put('/admin/livres/:id/statut', adminMiddleware, controller.updateLivreStatut);
router.delete('/admin/livres/:id', adminMiddleware, controller.deleteLivre);

// Routes emprunts
router.get('/admin/emprunts', adminMiddleware, controller.getAllEmprunts);
router.post('/admin/emprunts', adminMiddleware, controller.createEmprunt);
router.put('/admin/emprunts/:id/retour', adminMiddleware, controller.marquerEmpruntRendu);
router.put('/admin/emprunts/:id', adminMiddleware, controller.updateEmprunt);
router.put('/admin/emprunts/:id/statut', adminMiddleware, controller.updateEmpruntStatut);

// Routes auteurs
router.get('/admin/auteurs/pending', adminMiddleware, controller.getPendingAuteurs);
router.put('/auteurs/:id/validate', adminMiddleware, controller.validateAuteur);
router.post('/admin/auteurs', adminMiddleware, controller.createAuteur);
router.get('/admin/auteurs', adminMiddleware, controller.getAllAuteurs);
router.get('/admin/auteurs/:id', adminMiddleware, controller.getAuteurById);
router.put('/admin/auteurs/:id', adminMiddleware, controller.updateAuteur);
router.delete('/admin/auteurs/:id', adminMiddleware, controller.deleteAuteur);

// Routes catégories
router.post('/admin/categories', adminMiddleware, controller.createCategorie);
router.get('/admin/categories', adminMiddleware, controller.getAllCategories);
router.get('/admin/categories/:id', adminMiddleware, controller.getCategorieById);
router.put('/admin/categories/:id', adminMiddleware, controller.updateCategorie);
router.delete('/admin/categories/:id', adminMiddleware, controller.deleteCategorie);

// Routes utilisateurs
router.get('/admin/users', adminMiddleware, controller.getAllUsers);
router.post('/admin/users/:userId/avertissements', adminMiddleware, controller.addAvertissement);

// Routes commentaires
router.get('/admin/commentaires', adminMiddleware, controller.getAllCommentaires);
router.put('/admin/commentaires/:id/moderation', adminMiddleware, controller.moderateCommentaire);

module.exports = router;