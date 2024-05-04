import type { JestConfigWithTsJest } from 'ts-jest';
import { jsWithTsESM as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  transform: {
    ...tsjPreset.transform,
  },
  testPathIgnorePatterns: ['out'],
};

export default jestConfig;
