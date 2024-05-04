import { escapeQuote } from '../helpers/escape-quote';
import { TypedColumns } from '../inference/type-inference';

/**
 * Generate the header row for the SQL insertion.
 * @param header the header values.
 * @returns A tuple containing the header row, sanitized and formatted.
 */
const generateColumnNamesTuple = (columnsNames: string[]) => {
  return `\t(${columnsNames.reduce((p, c) => `${p}\`${escapeQuote(c)}\`, `, '').slice(0, -2)})\n `;
};

/**
 * Generates an insert tuple: (x, y, ...).
 * @param row A row mapping a string with anything.
 * @param columnsTypes The types of the columns.
 * @returns an SQL insertion row.
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

export const generateInsert = (
  tableName: string,
  columnsNames: string[],
  columnsTypes: TypedColumns,
  data: any,
) => {
  let insertQuery = `insert into \`${tableName}\` \n${generateColumnNamesTuple(columnsNames)}values \n`;

  data.forEach((row: Map<string, any>, index: number) => {
    const isLastRow = index == data.length - 1;
    if (isLastRow) {
      insertQuery += generateColumnValuesTuple(row, columnsTypes).slice(0, -3) + ';\n';
    } else {
      insertQuery += generateColumnValuesTuple(row, columnsTypes);
    }
  });

  return insertQuery;
};

export const generateMultipleInsert = (
  tableName: string,
  columnsNames: string[],
  columnsTypes: TypedColumns,
  data: any,
) => {
  let insertQueries = '';
  data.forEach((row: Map<string, any>) => {
    insertQueries += `insert into \`${tableName}\` \n${generateColumnNamesTuple(columnsNames)}values \n`;
    insertQueries += generateColumnValuesTuple(row, columnsTypes).slice(0, -3) + ';\n';
  });

  return insertQueries;
};
