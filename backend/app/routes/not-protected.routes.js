const router = require('express').Router();
const controller = require('../controllers/not-protected.controller');
const { verifySignUp, authJwt } = require('../middleware');
const validate = require('../middleware/validate');
const { registerValidation, registerAuteurValidation, loginValidation } = require('../utils/validation/auth.validation');

router.post('/auth/signup', [validate(registerValidation), verifySignUp.checkDuplicateUsernameOrEmail], controller.signup);
router.post('/auth/signup-auteur', [validate(registerAuteurValidation), verifySignUp.checkDuplicateUsernameOrEmail], controller.signupAuteur);
router.post('/auth/signin', validate(loginValidation), controller.signin);
router.get('/me', [authJwt.verifyToken], controller.getProfile);
router.put('/me', [authJwt.verifyToken], controller.updateProfile);
router.get('/me/avertissements', [authJwt.verifyToken], controller.getAvertissements);
router.put('/me/avertissements/:avertissementId/lu', [authJwt.verifyToken], controller.marquerAvertissementLu);

module.exports = router;