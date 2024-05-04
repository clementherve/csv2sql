import { escapeQuote } from '../helpers/escape-quote';
import { TypedColumns } from '../inference/type-inference';

/**
 * Generate the header row (A, B, C).
 */
const generateColumnNamesTuple = (columnsNames: string[]) => {
  return `\t(${columnsNames.reduce((p, c) => `${p}\`${escapeQuote(c)}\`, `, '').slice(0, -2)})\n `;
};

/**
 * Generates the value tuple: (x, y, ...).
 */
const generateColumnValuesTuple = (row: Map<string, any>, columnsTypes: TypedColumns) => {
  const types = Object.values(columnsTypes);

  // todo: fixme -> specific to mssql
  return `\t(${Object.values(row)
    .reduce((p: string, c: string, i: number) => {
      if (types[i] === 'int' || types[i] === 'double') {
        return `${p}${escapeQuote(c)}, `;
      } else if (types[i] === 'tinyint') {
        return `${p}${c.toLowerCase() === 'true' ? 1 : 0}, `;
      } else {
        return `${p}'${escapeQuote(c)}', `;
      }
    }, '')
    .slice(0, -2)}), \n`;
};

type Options = {
  tableName: string;
  columnNames: string[];
  columnTypes: TypedColumns;
  rows: any[];
};

export const createSingleInsertQuery = (options: Options) => {
  let insertQuery = `insert into \`${options.tableName}\` \n${generateColumnNamesTuple(
    options.columnNames,
  )}values \n`;

  options.rows.forEach((row: Map<string, any>, index: number) => {
    const isLastRow = index === options.rows.length - 1;

    if (isLastRow) {
      insertQuery += generateColumnValuesTuple(row, options.columnTypes).slice(0, -3) + ';\n';
    } else {
      insertQuery += generateColumnValuesTuple(row, options.columnTypes);
    }
  });

  return insertQuery;
};

export const createMultipleInsertQuery = (options: Options) => {
  let insertQueries = '';
  options.rows.forEach((row: Map<string, any>) => {
    insertQueries += `insert into \`${options.tableName}\` \n${generateColumnNamesTuple(
      options.columnNames,
    )}values \n`;
    insertQueries += generateColumnValuesTuple(row, options.columnTypes).slice(0, -3) + ';\n';
  });

  return insertQueries;
};
