const request = require('supertest');
const app = require('../server');
const { User, Livre, Auteur, CategorieLivre } = require('../models');
const { createTestUser } = require('./helpers');

let adminToken;
let adminUser;

beforeAll(async () => {
  const adminData = await createTestUser(['admin']);
  adminUser = adminData.user;
  adminToken = adminData.token;
});

describe('Admin Controller Tests', () => {
  describe('GET /admin/livres', () => {
    it('should return all books when admin is authenticated', async () => {
      const response = await request(app)
        .get('/admin/livres')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/admin/livres');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /admin/livres', () => {
    it('should create a new book when admin is authenticated', async () => {
      const newBook = {
        titre: 'Test Book',
        description: 'Test Description',
        isbn: '1234567890123',
        couvertureUrl: 'http://test.com/cover.jpg',
        auteurId: adminUser.id,
        categories: []
      };

      const response = await request(app)
        .post('/admin/livres')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newBook);

      expect(response.statusCode).toBe(201);
      expect(response.body.titre).toBe(newBook.titre);
    });
  });

  describe('GET /admin/auteurs', () => {
    it('should return all authors when admin is authenticated', async () => {
      const response = await request(app)
        .get('/admin/auteurs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /admin/categories', () => {
    it('should create a new category when admin is authenticated', async () => {
      const newCategory = {
        nom: 'Test Category',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCategory);

      expect(response.statusCode).toBe(201);
      expect(response.body.nom).toBe(newCategory.nom);
    });
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Livre.deleteMany({});
  await Auteur.deleteMany({});
  await CategorieLivre.deleteMany({});
});
