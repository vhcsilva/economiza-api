/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  roots: ['<rootDir>'],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  rootDir: ".",
  testEnvironment: "node",
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
};

module.exports = config;
