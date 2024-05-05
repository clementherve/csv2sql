import { NullableColumns } from '../inference/nullity-inference';
import { TypedColumns } from '../inference/type-inference';
import { UniqueColumns } from '../inference/uniqueness-inference';

type Options = {
  tableName: string;
  columnNames: string[];
  columnTypes: TypedColumns;
  columnUnique: UniqueColumns;
  columnNullable: NullableColumns;
};

export const createTableQuery = (options: Options) => {
  const dropTable = `drop table if exists \`${options.tableName}\``;
  const createTable = `create table if not exists \`${options.tableName}\``;

  return `${dropTable}; ${createTable} (${options.columnNames
    .reduce((acc: string, columnName: string) => `${acc}\`${createTableColumn(columnName, options)}`, '')
    .slice(0, -2)}); `;
};

const createTableColumn = (columnName: string, options: Options) => {
  const type = options.columnTypes[columnName];
  const unique = options.columnUnique[columnName] ? ' unique' : '';
  const nullable = options.columnNullable[columnName] ? '' : ' not null';

  return `${columnName}\` ${type}${unique}${nullable}, `;
};
