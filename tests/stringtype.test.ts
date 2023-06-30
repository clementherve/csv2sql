import stringTypeOf from '../out/string_type.js'

test('parsing integers', () => {
    expect(stringTypeOf('0')).toBe('int');
    expect(stringTypeOf('12345')).toBe('int');
    expect(stringTypeOf('-15')).toBe('int');

    expect(stringTypeOf('25.0')).toBe('double');
    expect(stringTypeOf('-25.0')).toBe('double');
    expect(stringTypeOf('0.25')).toBe('double');
});

test('parsing double', () => {
    expect(stringTypeOf('25.0')).toBe('double');
    expect(stringTypeOf('-25.0')).toBe('double');
    expect(stringTypeOf('0.25')).toBe('double');
});

test('parsing boolean', () => {
    expect(stringTypeOf('false')).toBe('bool');
    expect(stringTypeOf('False')).toBe('bool');
    expect(stringTypeOf('true')).toBe('bool');
    expect(stringTypeOf('True')).toBe('bool');
})

test('parsing string', () => {
    expect(stringTypeOf('abc')).toBe('string');
})


