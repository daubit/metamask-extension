module.exports = {
  restoreMocks: true,
  coverageDirectory: 'jest-coverage/',
  coverageThreshold: {
    global: {
      branches: 21.24,
      functions: 23.01,
      lines: 26.97,
      statements: 26.85,
    },
  },
  setupFiles: ['./test/setup.js', './test/env.js'],
  setupFilesAfterEnv: ['./test/jest/setup.js'],
  testMatch: ['**/ui/**/?(*.)+(test).js'],
};
