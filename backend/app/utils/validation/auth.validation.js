const Joi = require('joi');

const registerValidation = {
  body: Joi.object({
    username: Joi.string()
      .required()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .messages({
        'string.empty': 'Le nom d\'utilisateur est requis',
        'string.min': 'Le nom d\'utilisateur doit contenir au moins {#limit} caractères',
        'string.max': 'Le nom d\'utilisateur ne doit pas dépasser {#limit} caractères',
        'string.pattern.base': 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        'string.empty': 'L\'email est requis',
        'string.email': 'Veuillez fournir un email valide'
      }),
    password: Joi.string()
      .required()
      .min(6)
      .regex(/^(?=.*[A-Za-z])(?=.*\d).*$/)
      .messages({
        'string.empty': 'Le mot de passe est requis',
        'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères',
        'string.pattern.base': 'Le mot de passe doit contenir au moins une lettre et un chiffre'
      })
  })
};

const registerAuteurValidation = {
  body: Joi.object({
    username: Joi.string()
      .required()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .messages({
        'string.empty': 'Le nom d\'utilisateur est requis',
        'string.min': 'Le nom d\'utilisateur doit contenir au moins {#limit} caractères',
        'string.max': 'Le nom d\'utilisateur ne doit pas dépasser {#limit} caractères',
        'string.pattern.base': 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        'string.empty': 'L\'email est requis',
        'string.email': 'Veuillez fournir un email valide'
      }),
    password: Joi.string()
      .required()
      .min(6)
      .regex(/^(?=.*[A-Za-z])(?=.*\d).*$/)
      .messages({
        'string.empty': 'Le mot de passe est requis',
        'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères',
        'string.pattern.base': 'Le mot de passe doit contenir au moins une lettre et un chiffre'
      }),
    nom: Joi.string()
      .required()
      .min(2)
      .max(50)
      .messages({
        'string.empty': 'Le nom est requis',
        'string.min': 'Le nom doit contenir au moins {#limit} caractères',
        'string.max': 'Le nom ne doit pas dépasser {#limit} caractères'
      }),
    nationalite: Joi.string()
      .required()
      .min(2)
      .max(50)
      .messages({
        'string.empty': 'La nationalité est requise',
        'string.min': 'La nationalité doit contenir au moins {#limit} caractères',
        'string.max': 'La nationalité ne doit pas dépasser {#limit} caractères'
      }),
    bio: Joi.string()
      .required()
      .min(10)
      .max(1000)
      .messages({
        'string.empty': 'La biographie est requise',
        'string.min': 'La biographie doit contenir au moins {#limit} caractères',
        'string.max': 'La biographie ne doit pas dépasser {#limit} caractères'
      })
  })
};

const loginValidation = {
  body: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .messages({
        'string.empty': 'L\'email est requis',
        'string.email': 'Veuillez fournir un email valide'
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Le mot de passe est requis'
      })
  })
};

module.exports = {
  registerValidation,
  registerAuteurValidation,
  loginValidation
};