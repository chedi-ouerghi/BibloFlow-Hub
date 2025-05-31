module.exports = {
  secret: process.env.JWT_SECRET,
  jwtExpiration: 86400,           // 24 hours
  jwtRefreshExpiration: 604800,   // 7 days
  // Autres options de sécurité
  passwordMinLength: 6,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes
};