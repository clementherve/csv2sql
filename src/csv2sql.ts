const csvToJSON = require('csvtojson');
const fs = require('fs');
const path = require('path');
const strTypeOf = require('./string_type')

type columsUntyped = {
  [index: string]: string[]
}

module.exports = (filename: string, schema: string | undefined) => {
  const tablename = path.basename(filename,'.csv').replace(/[\s-]+/g, "_");
  const outputFile = `./${tablename}.sql`;
  const shouldInferSchema = schema == undefined; 

  csvToJSON({
    trim: true,
    noheader: !shouldInferSchema,
    delimiter: 'auto',
    quote: undefined,
  })
    .fromFile(filename)
    .then((json: object[]) => {
      const header = Object.keys(json[0]);
      
      // order values by column name
      const columns: columsUntyped = json.reduce((prev: any, curr: any) => {
        Object.keys(curr).forEach((key: string) => {
          if (key in prev) {
            prev[key] = [...prev[key], curr[key]];
          } else {
            prev[key] = [curr[key]];
          }
        });
        
        return prev;
      }, {});

      fs.writeFileSync(outputFile,  tableCreation(tablename, header, columns));

      // Generate the list of columns in the insert statement
      fs.appendFileSync(outputFile, `insert into '${tablename}' (`);
      
      // TODO

      fs.appendFileSync(outputFile, "; ");
  //     // for (let j = 0; j < keys.length; j++) {
  //     //   if (j === 0) {
  //     //     fs.appendFileSync(outputFile, keys[j]);
  //     //   } else {
  //     //     fs.appendFileSync(outputFile, ',' + keys[j]);
  //     //   }
  //     // }
  //     // fs.appendFileSync(outputFile, ") \n values ");
  //     // // Generate the values in the insert statement
  //     // for (let i = 0; i < jsonArrayObj.length; i++) {
  //     //   var obj = jsonArrayObj[i];
  //     //   if (i === 0) {
  //     //     fs.appendFileSync(outputFile, '\n(')
  //     //   } else {
  //     //     fs.appendFileSync(outputFile, '\n,(')
  //     //   }
  //     //   // comma seperated list of single quoted values (escape single quotes with two single quotes)
  //     //   for (var k = 0; k < keys.length; k++) {
  //     //     var colValue = obj[keys[k]].replace(new RegExp("'", "g"), "''");
  //     //     if (k === 0) {
  //     //       fs.appendFileSync(outputFile, "'" + colValue + "'");
  //     //     } else {
  //     //       fs.appendFileSync(outputFile, "," + "'" + colValue + "'");
  //     //     }
  //     //   }
  //     //   fs.appendFileSync(outputFile, ')')
  //     // }
  })
}


type columnsType = {
  [index: string]: string | undefined
}


/**
 * Infers SQL types based on values typing consistency across each column.
 * @param columns Values of each column, referenced by their column's name.
 * @returns A type object, with keys being the name from the header, and the value being a valid SQL type.
 */
const inferTypeFromData = (columns: columsUntyped): columnsType => {
  const typeGuess: {[index: string]: any} = {
    'tinyint': (value: any): boolean => strTypeOf(value) == 'bool',
    'int': (value: any): boolean => strTypeOf(value) == 'int',
    'double': (value: any): boolean => strTypeOf(value) == 'double',
    'text': (value: any): boolean => strTypeOf(value) == 'string',
  }

  const types: columnsType = {};

  Object.keys(columns).forEach((colName: string, i: number): void => {
    if (types[colName] != undefined) return;
    
    types[colName] = undefined;

    Object.keys(typeGuess).forEach((value: string, index: number):void => {
      const type: string = Object.keys(typeGuess)[index];

      const isTypeConsistent: boolean = columns[colName].every((value: any, index: number): boolean => {
        return typeGuess[type](value);
      })
      
      types[colName] = isTypeConsistent ? type : types[colName];
    });
  })

  console.log(types);
  
  return types;
}


/**
 * Create a SQL table schema.
 * @param tablename Name of the table.
 * @param header Header row of the csv file. If not present, the function should not be called.
 * @param columns The columns values. Used to infer types.
 * @returns A create statement for the table.
 */
const tableCreation = (tablename: string, header: string[], columns: columsUntyped) => {
  
  const columnTypes = inferTypeFromData(columns);

  const createTable = header.reduce((prev: string, curr: string) => {
    return `${prev}${curr} ${columnTypes[curr]},\n\t`;
  }, '').slice(0, -3);

  return `drop table if exists '${tablename}';\ncreate table if not exists '${tablename}' (\n\t${createTable}\n);\n`;
}