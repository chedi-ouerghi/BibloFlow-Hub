const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('Not Protected Controller Tests', () => {
  describe('POST /auth/signup', () => {
    it('should create a new user successfully', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roles: ['user']
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Utilisateur enregistré avec succès!');
      expect(response.body).toHaveProperty('userId');
    });

    it('should not allow duplicate username', async () => {
      const existingUser = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Créer d'abord un utilisateur
      await User.create({
        ...existingUser,
        password: bcrypt.hashSync(existingUser.password, 8)
      });

      // Essayer de créer un utilisateur avec le même nom d'utilisateur
      const response = await request(app)
        .post('/auth/signup')
        .send(existingUser);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/signin', () => {
    beforeAll(async () => {
      // Créer un utilisateur pour les tests de connexion
      await User.create({
        username: 'logintest',
        email: 'login@test.com',
        password: bcrypt.hashSync('testpass123', 8)
      });
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        username: 'logintest',
        password: 'testpass123'
      };

      const response = await request(app)
        .post('/auth/signin')
        .send(loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should not login with incorrect password', async () => {
      const loginData = {
        username: 'logintest',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/auth/signin')
        .send(loginData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/signup-auteur', () => {
    it('should create a new author account', async () => {
      const newAuteur = {
        username: 'auteurtest',
        email: 'auteur@test.com',
        password: 'password123',
        nom: 'Test Auteur',
        bio: 'Test Bio',
        nationalite: 'Test Nationalité'
      };

      const response = await request(app)
        .post('/auth/signup-auteur')
        .send(newAuteur);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('auteurId');
    });
  });
});

afterEach(async () => {
  await User.deleteMany({});
});
