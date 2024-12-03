module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  rootDir: './',
  maxWorkers: 1,
  testTimeout: 9000,
  moduleNameMapper: {
    '^#src/(.*)$': '<rootDir>/src/$1',
    '^#test/(.*)$': '<rootDir>/test/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['<rootDir>/test/unit-tests/*.spec.ts', '<rootDir>/test/e2e-tests/*.e2e.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './test/coverage',
  cache: false,
  globals: {
    NODE_ENV: 'test',
  },
};
