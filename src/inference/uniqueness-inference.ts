import { UntypedColumns } from './type-inference.js';

type ColumnName = string;

export type UniqueColumns = Record<ColumnName, boolean>;

/**
 * Infers uniqueness of values for each column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A columnUnique object, with column names being keys referencing a boolean. true -> unique.
 */
export const inferUniqueness = (columns: UntypedColumns): UniqueColumns => {
  const unique: UniqueColumns = {};

  Object.keys(columns).map((columnName: string) => {
    const columnData = columns[columnName]!.slice(1);

    columnData.forEach((value: any) => {
      if (unique[columnName] !== false || !(columnName in unique)) {
        unique[columnName] = columnData.lastIndexOf(value) === columnData.indexOf(value);
      }
    });
  });

  return unique;
};
