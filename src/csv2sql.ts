import csvToJSON from 'csvtojson';
import { createTableQuery } from './create/table.js';
import { inferTypeFromData, UntypedColumns } from './inference/type-inference.js';
import { inferUniqueness } from './inference/uniqueness-inference.js';
import { inferNullity } from './inference/nullity-inference.js';
import { createMultipleInsertQuery, createSingleInsertQuery } from './create/insert.js';
import SqliteMapper from './mapper/sqlite-mapper.js';

type Options = {
  tableName: string;
  createTable?: boolean;
  inferUnique?: boolean;
  multilineInsert?: boolean;
};

const csvToSql = async (csv: string, options: Options) => {
  const tableName = options.tableName;
  const inferUnique = !!options.inferUnique;
  const createTable = !!options.createTable;

  const json = await csvToJSON({
    trim: true,
    noheader: false,
    delimiter: 'auto',
    quote: '',
  }).fromString(csv);

  const columnNames = Object.keys(json[0]);

  // order values by column name
  const columns: UntypedColumns = json.reduce((prev: any, curr: any) => {
    Object.keys(curr).forEach((key: string) => {
      prev[key] = [...(prev[key] ?? [curr[key]]), curr[key]];
    });
    return prev;
  }, {});

  const columnTypes = inferTypeFromData(columns, new SqliteMapper());
  const columnUnique = inferUnique ? inferUniqueness(columns) : {};
  const columnNullable = inferNullity(columns);

  let query = '';

  if (createTable) {
    query += createTableQuery({
      tableName,
      columnNames,
      columnTypes,
      columnUnique,
      columnNullable,
    });
  }

  if (options.multilineInsert) {
    query += createMultipleInsertQuery({
      tableName,
      columnNames,
      columnTypes,
      rows: json,
    });
  } else {
    query += createSingleInsertQuery({
      tableName,
      columnNames,
      columnTypes,
      rows: json,
    });
  }

  return query;
};

export { csvToSql, csvToSql as csv2sql };
