type GenericTypes = 'double' | 'int' | 'bool' | 'string';

type TypeMapper = { [index in GenericTypes]: (value: string) => boolean };

const stringTypeOf = (value: string): string => {
  const types: TypeMapper = {
    double: (value: string) => Number.parseFloat(value).toString() !== 'NaN' && value.includes('.'),
    int: (value: string) => Number.parseInt(value).toString() !== 'NaN' && !value.includes('.'),
    bool: (value: string) => value.toLowerCase() === 'true' || value.toLowerCase() === 'false',
    string: (_: string) => true,
  };

  const genericTypes = Object.keys(types) as GenericTypes[];
  return genericTypes.find((type) => types[type](value)) ?? 'string';
};

export default stringTypeOf;
