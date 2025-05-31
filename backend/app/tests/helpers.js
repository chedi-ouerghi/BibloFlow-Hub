const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Auteur } = require('../models');
const config = require('../config/auth.config');

const createTestUser = async (roles = ['user']) => {
  const hashedPassword = await bcrypt.hash('password123', 8);
  const user = await User.create({
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: hashedPassword,
    roles: roles
  });

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400
  });

  return { user, token };
};

const createTestAuteur = async () => {
  const { user, token } = await createTestUser(['auteur']);
  const auteur = await Auteur.create({
    userId: user._id,
    nom: 'Test Auteur',
    bio: 'Test Bio',
    nationalite: 'Test'
  });

  return { user, auteur, token };
};

module.exports = {
  createTestUser,
  createTestAuteur
};
