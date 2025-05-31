const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bibliothèque',
      version: '1.0.0',
      description: 'API de gestion de bibliothèque',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            roles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['user', 'admin', 'auteur']
              }
            },
            estBanni: { type: 'boolean' },
            avertissements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  adminId: { type: 'string' },
                  dateCreation: { type: 'string', format: 'date-time' },
                  estLu: { type: 'boolean' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            lastLogin: { type: 'string', format: 'date-time' }
          }
        },
        Livre: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            titre: { type: 'string' },
            description: { type: 'string' },
            couvertureUrl: { type: 'string' },
            categories: {
              type: 'array',
              items: { $ref: '#/components/schemas/CategorieLivre' }
            },
            auteur: { $ref: '#/components/schemas/Auteur' },
            statut: {
              type: 'string',
              enum: ['draft', 'published', 'hidden']
            },
            noteMoyenne: { type: 'number', minimum: 0, maximum: 5 },
            dateCreation: { type: 'string', format: 'date-time' },
            datePublication: { type: 'string', format: 'date-time' },
            commentaires: {
              type: 'array',
              items: { $ref: '#/components/schemas/Commentaire' }
            }
          }
        },
        CategorieLivre: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nom: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            couleur: { type: 'string' },
            parent: { type: 'string' },
            estActive: { type: 'boolean' }
          },
          required: ['nom']
        },
        Auteur: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            nom: { type: 'string' },
            bio: { type: 'string' },
            photo: { type: 'string' },
            dateNaissance: { type: 'string', format: 'date' },
            nationalite: { type: 'string' },
            estActif: { type: 'boolean' },
            livres: {
              type: 'array',
              items: { $ref: '#/components/schemas/Livre' }
            }
          }
        },
        Commentaire: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            livreId: { type: 'string' },
            userId: { $ref: '#/components/schemas/User' },
            contenu: { type: 'string' },
            note: { type: 'number', minimum: 1, maximum: 5 },
            estVisible: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'], // chemins des fichiers contenant la documentation
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;