import SqliteMapper from '../src/mapper/sqlite-mapper';

const sqliteMapper = new SqliteMapper();

test('SqliteMapper should correctly map text', () => {
  const mappedValue = sqliteMapper.inferTypeFromValue('hello');
  expect(mappedValue).toBe('text');
});

test('SqliteMapper should correctly map int', () => {
  const mappedValue = sqliteMapper.inferTypeFromValue('42');
  expect(mappedValue).toBe('int');
});

test('SqliteMapper should correctly map double', () => {
  const mappedValue = sqliteMapper.inferTypeFromValue('42.2');
  expect(mappedValue).toBe('double');
});

test('SqliteMapper should correctly map boolean', () => {
  const mappedValue = sqliteMapper.inferTypeFromValue('true');
  expect(mappedValue).toBe('tinyint');
});
