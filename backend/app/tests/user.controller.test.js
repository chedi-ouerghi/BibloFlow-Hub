const request = require('supertest');
const app = require('../server');
const { User, Livre, Commentaire, Note } = require('../models');
const { createTestUser } = require('./helpers');

let userToken;
let testUser;
let testLivre;

beforeAll(async () => {
  // Créer un utilisateur pour les tests
  const userData = await createTestUser(['user']);
  testUser = userData.user;
  userToken = userData.token;

  // Créer un livre pour les tests
  testLivre = await Livre.create({
    titre: 'Test Livre',
    description: 'Description test',
    isbn: '1234567890123',
    statut: 'published',
    couvertureUrl: 'http://test.com/cover.jpg'
  });
});

describe('User Controller Tests', () => {
  describe('GET /livres', () => {
    it('should return all published books', async () => {
      const response = await request(app)
        .get('/livres');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow filtering books by category', async () => {
      const response = await request(app)
        .get('/livres')
        .query({ categorie: 'roman' });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /livres/:id/commentaires', () => {
    it('should allow authenticated user to add a comment', async () => {
      const commentData = {
        contenu: 'Test commentaire'
      };

      const response = await request(app)
        .post(`/livres/${testLivre._id}/commentaires`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('contenu', commentData.contenu);
    });

    it('should not allow unauthenticated user to add a comment', async () => {
      const commentData = {
        contenu: 'Test commentaire'
      };

      const response = await request(app)
        .post(`/livres/${testLivre._id}/commentaires`)
        .send(commentData);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /emprunts/:livreId', () => {
    it('should allow user to borrow a book', async () => {
      const response = await request(app)
        .post(`/emprunts/${testLivre._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('livre');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('dateEmprunt');
    });

    it('should not allow borrowing the same book twice', async () => {
      // Premier emprunt
      await request(app)
        .post(`/emprunts/${testLivre._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      // Deuxième tentative d'emprunt
      const response = await request(app)
        .post(`/emprunts/${testLivre._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /mes-emprunts', () => {
    it('should return user\'s borrowed books', async () => {
      const response = await request(app)
        .get('/mes-emprunts')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Livre.deleteMany({});
  await Commentaire.deleteMany({});
  await Note.deleteMany({});
});
