import { schemaParser } from '../out/schema_parser'

test('simple schema', async () => {
    const sqlSchema = `
        create table if not exists 'example' (
        'A' int, 
        'B' text, 
    ); 
    `;
    const schema = await schemaParser(sqlSchema);

    expect(schema).toEqual({
        'A': {
            'type': 'int',
            'unique': false,
            'primary': false,
            'foreign': false,
            'not_null': false
        },
        'B': {
            'type': 'text',
            'unique': false,
            'primary': false,
            'foreign': false,
            'not_null': false
        }
    })

});