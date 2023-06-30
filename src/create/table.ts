import { nullableColumns } from '../inference/nullity-inference';
import { typedColumns } from '../inference/type-inference';
import { uniqueColumns } from '../inference/uniqueness-inference';

/**
 * Create a SQL table schema.
 * @param tablename Name of the table.
 * @param header Header row of the csv file. If not present, the function should not be called.
 * @param columnTypes The columns types
 * @returns A create statement for the table.
 */
export const tableCreation = (
  tablename: string,
  header: string[],
  columnTypes: typedColumns,
  unique: uniqueColumns,
  nullable: nullableColumns,
) => {
  const createTable = header
    .reduce((prev: string, collName: string) => {
      return `${prev}\`${collName}\` ${columnTypes[collName]}${unique[collName] ? ' unique' : ''}${
        nullable[collName] ? '' : ' not null'
      }, \n\t`;
    }, '')
    .slice(0, -4);

  return `drop table if exists \`${tablename}\`; \ncreate table if not exists \`${tablename}\` (\n\t${createTable}\n); \n`;
};
