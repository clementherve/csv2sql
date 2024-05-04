import csvToJSON from 'csvtojson';
import stringTypeOf from './string_type';

type columnsType = {
  [index: string]: string | undefined;
};
type columsUntyped = {
  [index: string]: string[];
};
type columnsUnique = {
  [index: string]: boolean;
};
type columnsNullable = {
  [index: string]: boolean;
};

const csv2sql = async (csv: string, tablename: string, inferTypes?: boolean, sqlSchema?: string) => {
  const shouldInferSchema = sqlSchema == undefined;

  const json = await csvToJSON({
    trim: true,
    noheader: !shouldInferSchema,
    delimiter: 'auto',
    quote: undefined,
  }).fromString(csv);

  const header = Object.keys(json[0]);

  // order values by column name
  const columns: columsUntyped = json.reduce((prev: any, curr: any) => {
    Object.keys(curr).forEach((key: string) => {
      prev[key] = [...(prev[key] ?? [curr[key]]), curr[key]];
    });
    return prev;
  }, {});

  const columnTypes = inferTypeFromData(columns);
  const columnUnique = inferUniqueness(columns);
  const columnNullable = inferNullity(columns);

  let query = tableCreation(tablename, header, columnTypes, columnUnique, columnNullable);

  // Generate the list of columns in the insert statement
  query += `insert into \`${tablename}\` \n${generateHeader(header)}values \n`;

  // generate the insert tuples
  json.forEach((row: Map<string, any>, index: number) => {
    // last row is different
    const insert =
      index == json.length - 1
        ? generateTuple(row, columnTypes).slice(0, -3) + ';\n'
        : generateTuple(row, columnTypes);
    query += insert;
  });

  return query;
};

/**
 * Sanitize a string. Basically escapes the '.
 * @param value A string to sanitize.
 * @returns The same string, but with ' escaped with '\'.
 */
const sanitize = (value: string): string | null => {
  const sanitized = value.replace(new RegExp("'", 'g'), "\\'");
  return sanitized != '' ? sanitized : null;
};

/**
 * Generate the header row for the SQL insertion.
 * @param header the header values.
 * @returns A tuple containing the header row, sanitized and formatted.
 */
const generateHeader = (header: string[]) => {
  return `\t(${header.reduce((p, c) => `${p}\`${sanitize(c)}\`, `, '').slice(0, -2)})\n `;
};

/**
 * Generates an insert tuple: (x, y, ...).
 * @param row A row mapping a string with anything.
 * @param columnsTypes The types of the columns.
 * @returns an SQL insertion row.
 */
const generateTuple = (row: Map<string, any>, columnsTypes: columnsType) => {
  const types = Object.values(columnsTypes);

  return `\t(${Object.values(row)
    .reduce((p: string, c: string, i: number) => {
      if (types[i] === 'int' || types[i] === 'double') {
        return `${p}${sanitize(c)}, `;
      } else if (types[i] === 'tinyint') {
        return `${p}${c.toLowerCase() === 'true' ? 1 : 0}, `;
      } else {
        return `${p}'${sanitize(c)}', `;
      }
    }, '')
    .slice(0, -2)}), \n`;
};

/**
 * Infers SQL types based on values typing consistency across each column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A columnsType object, with keys being the name from the header, and the value being a valid SQL type.
 */
const inferTypeFromData = (columns: columsUntyped): columnsType => {
  const typeGuess: { [index: string]: any } = {
    tinyint: (value: any): boolean => stringTypeOf(value) == 'bool',
    int: (value: any): boolean => stringTypeOf(value) == 'int',
    double: (value: any): boolean => stringTypeOf(value) == 'double',
    text: (value: any): boolean => stringTypeOf(value) == 'string',
  };
  const types: columnsType = {};

  Object.keys(columns).forEach((colName: string, i: number): void => {
    if (types[colName] != undefined) return;

    types[colName] = undefined;

    Object.keys(typeGuess).forEach((value: string, index: number): void => {
      const type: string = Object.keys(typeGuess)[index];

      const isTypeConsistent: boolean = columns[colName]
        .filter((value) => value != '')
        .every((value: any): boolean => {
          return typeGuess[type](value);
        });

      types[colName] = isTypeConsistent ? type : types[colName];
    });
  });

  return types;
};

/**
 * Infers uniqueness for each column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A columnUnique object, with column names being keys referencing a boolean. true -> unique.
 */
const inferUniqueness = (columns: columsUntyped): columnsUnique => {
  const unique: columnsUnique = {};
  Object.keys(columns).map((collName: string) => {
    const col = columns[collName].slice(1);
    col.forEach((value: any, i: number) => {
      if (unique[collName] != false || !(collName in unique)) {
        unique[collName] = col.lastIndexOf(value) == col.indexOf(value);
      }
    });
  });
  return unique;
};

/**
 * Infers the nullable aspect of a column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A columnsNullable object, with column names being keys referencing a boolean. true -> nullable.
 */
const inferNullity = (columns: columsUntyped): columnsNullable => {
  const isNullable: columnsNullable = {};

  Object.keys(columns).map((collName: string) => {
    const col = columns[collName].slice(1);
    col.forEach((value: any, i: number) => {
      if (isNullable[collName] == false || !(collName in isNullable)) {
        isNullable[collName] = value == '';
      }
    });
  });

  return isNullable;
};

/**
 * Create a SQL table schema.
 * @param tablename Name of the table.
 * @param header Header row of the csv file. If not present, the function should not be called.
 * @param columnTypes The columns types
 * @returns A create statement for the table.
 */
const tableCreation = (
  tablename: string,
  header: string[],
  columnTypes: columnsType,
  unique: columnsUnique,
  nullable: columnsNullable,
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

export { csv2sql };
