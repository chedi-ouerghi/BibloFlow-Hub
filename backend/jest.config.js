module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./app/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'app/**/*.js',
    '!app/tests/**'
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  moduleDirectories: ['node_modules', 'app'],
  globals: {
    'process.env.NODE_ENV': 'test',
    'process.env.JWT_SECRET': 'test-secret-key'
  }
};
