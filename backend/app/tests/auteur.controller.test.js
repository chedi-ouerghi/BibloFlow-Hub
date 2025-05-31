const request = require('supertest');
const app = require('../server');
const { User, Livre, Auteur } = require('../models');
const { createTestAuteur } = require('./helpers');

let auteurToken;
let auteurUser;
let auteurProfile;

beforeAll(async () => {
  const auteurData = await createTestAuteur();
  auteurUser = auteurData.user;
  auteurProfile = auteurData.auteur;
  auteurToken = auteurData.token;
});

describe('Auteur Controller Tests', () => {
  describe('POST /auteur/livres', () => {
    it('should allow an author to publish a book', async () => {
      const newBook = {
        titre: 'Test Book',
        description: 'Test Description',
        isbn: '1234567890123',
        couvertureUrl: 'http://test.com/cover.jpg',
        categories: [],
        langue: 'Français',
        nombrePages: 200
      };

      const response = await request(app)
        .post('/auteur/livres')
        .set('Authorization', `Bearer ${auteurToken}`)
        .send(newBook);

      expect(response.statusCode).toBe(201);
      expect(response.body.titre).toBe(newBook.titre);
    });

    it('should not allow publishing without required fields', async () => {
      const invalidBook = {
        titre: 'Test Book'
      };

      const response = await request(app)
        .post('/auteur/livres')
        .set('Authorization', `Bearer ${auteurToken}`)
        .send(invalidBook);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /auteur/livres', () => {
    it('should return all books by the author', async () => {
      const response = await request(app)
        .get('/auteur/livres')
        .set('Authorization', `Bearer ${auteurToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /auteur/livres/:id', () => {
    let bookId;

    beforeAll(async () => {
      // Créer un livre pour tester la mise à jour
      const livre = await Livre.create({
        titre: 'Test Book Update',
        description: 'Test Description',
        isbn: '9876543210123',
        auteur: auteurProfile._id,
        couvertureUrl: 'http://test.com/cover.jpg'
      });
      bookId = livre._id;
    });

    it('should update author\'s own book', async () => {
      const updateData = {
        titre: 'Updated Test Book',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/auteur/livres/${bookId}`)
        .set('Authorization', `Bearer ${auteurToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.titre).toBe(updateData.titre);
    });
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Livre.deleteMany({});
  await Auteur.deleteMany({});
});
