import { UntypedColumns } from './type-inference.js';

type ColumnName = string;

export type NullableColumns = Record<ColumnName, boolean>;
/**
 * Infers the nullable aspect of a column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A columnsNullable object, with column names being keys referencing a boolean. true -> nullable.
 */
export const inferNullity = (columns: UntypedColumns): NullableColumns => {
  const isNullable: NullableColumns = {};

  Object.keys(columns).map((columnName: string) => {
    const columnData = columns[columnName]!.slice(1);

    columnData.forEach((value: any) => {
      if (isNullable[columnName] === false || !(columnName in isNullable)) {
        isNullable[columnName] = value === '' || value === null || value === undefined;
      }
    });
  });

  return isNullable;
};
