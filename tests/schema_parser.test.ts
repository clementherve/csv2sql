test('simple schema', async () => {
  const sqlSchema = `
        create table if not exists 'example' (
        'A' int,
        'B' text,
    );
    `;
  //   const schema = await schemaParser(sqlSchema);

  expect(null).toEqual({
    A: {
      type: 'int',
      unique: false,
      primary: false,
      foreign: false,
      not_null: false,
    },
    B: {
      type: 'text',
      unique: false,
      primary: false,
      foreign: false,
      not_null: false,
    },
  });
});
