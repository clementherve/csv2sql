import { GenericMapperInterface, SpecificMapperInterface } from '../mapper/generic-mapper';

export type TypedColumns = Record<string, string | undefined>;
export type UntypedColumns = Record<string, string[]>;

const findCorrectType = (
  columnValues: string[],
  mapper: GenericMapperInterface & SpecificMapperInterface,
) => {
  for (const value of columnValues) {
    const inferredType = mapper.inferTypeFromValue(value);

    if (mapper.typeIsConsistantAcrossValues(columnValues, inferredType, mapper)) {
      return inferredType;
    }
  }

  return mapper.DEFAULT_TYPE();
};

/**
 * Infers SQL types based on values typing consistency across each column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A columnsType object, with keys being the name from the header, and the value being a valid SQL type.
 */
export const inferTypeFromData = (
  columns: UntypedColumns,
  mapper: GenericMapperInterface & SpecificMapperInterface,
): TypedColumns => {
  const types: TypedColumns = {};

  Object.keys(columns)
    .filter((columnName) => types[columnName] === undefined)
    .forEach((columnName: string): void => {
      types[columnName] = findCorrectType(columns[columnName] ?? [], mapper);
    });

  return types;
};
