const nextJest = require('next/jest');

// Provide the path to your Next.js app to load `next.config.js` and `.env` files
const createJestConfig = nextJest({
  dir: './',
});

// Add custom Jest configuration
const customJestConfig = {
  // Run this setup file after the environment is set up
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Simulate the browser environment
  testEnvironment: 'jest-environment-jsdom',

  // Handle module aliases (like 'src/*') and CSS Modules
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Optional: if you use file imports like images or fonts
  // transformIgnorePatterns: ['/node_modules/'],
  // moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

// Export the customized Jest config
module.exports = createJestConfig(customJestConfig);
