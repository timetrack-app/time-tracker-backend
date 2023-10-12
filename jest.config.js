require('dotenv').config({ path: './env/.env.dev' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^test/(.*)$': '<rootDir>/src/test/$1',
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
