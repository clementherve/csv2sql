import chalk from 'chalk';
import fs from 'fs';
import { csv2sql } from './csvToSql.js';
import path from 'path';
import { ArgumentParser } from 'argparse';

const parser = new ArgumentParser();

parser.add_argument('-t', '--infer-type', {
  nargs: '*',
  help: 'Infer type in --create-table mode.',
});
parser.add_argument('-u', '--infer-unique', {
  nargs: '*',
  help: 'Infer uniqueness in --create-table mode.',
});
parser.add_argument('-m', '--multiline-insert', {
  nargs: '*',
  help: 'Prefer multiline insert instead of a single one.',
});
parser.add_argument('-s', '--schema', {
  help: 'You can provide a database schema file to help type inference.',
});
parser.add_argument('-T', '--create-table', {
  nargs: '*',
  help: 'Will produce a create table statement.',
});
parser.add_argument('-o', '--output', {
  nargs: '*',
  help: 'Output the result to a file.',
});

const args = parser.parse_args();
const csvFile = args[''];
const inferTypes = args['infer_type'] !== undefined;
const inferUnique = args['infer_unique'] !== undefined;
const multilineInsert = args['multiline_insert'] !== undefined;
const databaseSchemaFile = args['schema'];
const createTable = args['create_table'] !== undefined;

const tableName = path.basename(csvFile, '.csv').replace(/[\s-]+/g, '_');
const outputDirectory = path.dirname(csvFile);
const outputFile = `${outputDirectory}/${tableName}.sql`;

if (!fs.existsSync(csvFile)) {
  console.log(chalk.bold.red('Could not find the CSV file'));
  process.exit(-1);
}

if (databaseSchemaFile === undefined) {
  console.log(chalk.yellow('No SQL table creation file provided, I will create it from CSV header...'));
} else {
  if (inferTypes || inferUnique) {
    console.log(
      chalk.yellow(
        'Both schema inference and schema were provided. Provided schema will supercede the inferences',
      ),
    );
  }

  if (!fs.existsSync(databaseSchemaFile)) {
    console.log(chalk.bold.red('Could not find the SQL schema file'));
    process.exit(-1);
  }
}

const schema = databaseSchemaFile != undefined ? fs.readFileSync(databaseSchemaFile, 'utf-8') : undefined;

(async () => {
  console.log(chalk.grey(`- Reading ${csvFile}...`));
  const csv = fs.readFileSync(csvFile, 'utf-8');
  const SQL = await csv2sql(csv, tableName, false, schema);

  console.log(chalk.grey(`- Finished SQL generation`));
  console.log(chalk.bgHex('#A3BE8C').white(`File: ${outputFile}`));
  fs.writeFileSync(outputFile, SQL);
})();

/*







(async () => {
  console.log(chalk.grey(`- Reading ${csvFile}...`));
  const csv = fs.readFileSync(csvFile, 'utf-8');
  const SQL = await csv2sql(csv, tablename, false, DBSchema);
  
  console.log(chalk.grey(`- Finished SQL generation`));
  console.log(chalk.bgHex('#A3BE8C').white(`File: ${outputFile}`));
  fs.writeFileSync(outputFile, SQL);
})()
*/
