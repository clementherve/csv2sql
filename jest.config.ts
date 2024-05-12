import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  transform: {
    '\\.[jt]s$': 'ts-jest',
  },
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  testPathIgnorePatterns: ['out'],
};

export default jestConfig;
