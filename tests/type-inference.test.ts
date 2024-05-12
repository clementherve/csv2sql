import { inferTypeFromData } from '../src/inference/type-inference';
import SqliteMapper from '../src/mapper/sqlite-mapper';

describe('SqliteMapper', () => {
  describe('single type column', () => {
    test('text', () => {
      const inferredTypes = inferTypeFromData(
        {
          columnA: ['abc', 'def', 'ghi'],
        },
        new SqliteMapper(),
      );

      expect(inferredTypes).toStrictEqual({
        columnA: 'text',
      });
    });

    test('number', () => {
      const inferredTypes = inferTypeFromData(
        {
          columnA: ['1', '2', '3'],
        },
        new SqliteMapper(),
      );

      expect(inferredTypes).toStrictEqual({
        columnA: 'int',
      });
    });

    test('boolean', () => {
      const inferredTypes = inferTypeFromData(
        {
          columnA: ['true', 'false'],
        },
        new SqliteMapper(),
      );
      expect(inferredTypes).toStrictEqual({
        columnA: 'tinyint',
      });
    });
  });

  describe('mixed type column', () => {
    test('number & text', () => {
      const inferredTypes = inferTypeFromData(
        {
          columnA: ['1', 'hello'],
        },
        new SqliteMapper(),
      );
      expect(inferredTypes).toStrictEqual({
        columnA: 'text',
      });
    });

    test('number & boolean', () => {
      const inferredTypes = inferTypeFromData(
        {
          columnA: ['1', 'true'],
        },
        new SqliteMapper(),
      );
      expect(inferredTypes).toStrictEqual({
        columnA: 'text',
      });
    });

    test('text & boolean', () => {
      const inferredTypes = inferTypeFromData(
        {
          columnA: ['true', 'hello'],
        },
        new SqliteMapper(),
      );
      expect(inferredTypes).toStrictEqual({
        columnA: 'text',
      });
    });
  });
});
