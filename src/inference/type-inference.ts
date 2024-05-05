import stringTypeOf from '../helpers/string-type';

// type type = 'double' | 'int' | 'bool' | 'string';

// const typesFn: Record<type, (val: string) => Boolean> = {
//   double: (value: string) => Number.parseFloat(value).toString() !== 'NaN' && value.includes('.'),
//   int: (value: string) => Number.parseInt(value).toString() !== 'NaN' && !value.includes('.'),
//   bool: (value: string) => value.toLowerCase() === 'true' || value.toLowerCase() === 'false',
//   string: (_: string) => true,
// };

// const inferSqlTypeFrom = (value: string): type => {
//   return (Object.keys(typesFn) as type[]).find((type: type) => typesFn[type](value)) ?? 'string';
// };

type ColumnName = string;

export type TypedColumns = Record<ColumnName, string | undefined>;
export type UntypedColumns = Record<ColumnName, string[]>;

/**
 * Infers SQL types based on values typing consistency across each column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A columnsType object, with keys being the name from the header, and the value being a valid SQL type.
 */
export const inferTypeFromData = (columns: UntypedColumns): TypedColumns => {
  // fixme: this is mssql binding
  const typeGuess: { [index: string]: any } = {
    tinyint: (value: any): boolean => stringTypeOf(value) === 'bool',
    int: (value: any): boolean => stringTypeOf(value) === 'int',
    double: (value: any): boolean => stringTypeOf(value) === 'double',
    text: (value: any): boolean => stringTypeOf(value) === 'string',
  };
  const types: TypedColumns = {};

  Object.keys(columns).forEach((columnName: ColumnName): void => {
    if (types[columnName] !== undefined) {
      return;
    }

    types[columnName] = undefined;

    Object.keys(typeGuess).forEach((_: string, index: number): void => {
      const type: string = Object.keys(typeGuess)[index]!;

      const isTypeConsistent: boolean = columns[columnName]!.filter((value) => value !== '').every(
        (value: any): boolean => {
          return typeGuess[type](value);
        },
      );

      types[columnName] = isTypeConsistent ? type : types[columnName];
    });
  });

  return types;
};
