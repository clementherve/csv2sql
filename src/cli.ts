import chalk from 'chalk';
import fs from 'fs';
import { csv2sql } from './csvToSql';
import path from 'path';
import { ArgumentParser } from 'argparse';

const parser = new ArgumentParser();

parser.add_argument('-u', '--infer-unique', {
  nargs: '*',
  help: 'Infer uniqueness in --create-table mode.',
});
parser.add_argument('-m', '--multiline-insert', {
  nargs: '*',
  help: 'Prefer multiline insert instead of a single one.',
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
const csvFileName = args[''];
const inferUnique = args['infer_unique'] !== undefined;
const multilineInsert = args['multiline_insert'] !== undefined;
const createTable = args['create_table'] !== undefined;
const output = args['output'];

const tableName = path.basename(csvFileName, '.csv').replace(/[\s-]+/g, '_');

if (!fs.existsSync(csvFileName)) {
  console.log(chalk.bold.red('Could not find the CSV file'));
  process.exit(-1);
}

if (inferUnique) {
  console.log(
    chalk.yellow(
      'Both schema inference and schema were provided. Provided schema will supercede the inferences',
    ),
  );
}

(async () => {
  console.log(chalk.grey(`- Reading ${csvFileName}...`));

  const csv = fs.readFileSync(csvFileName, 'utf-8');
  const generatedSql = await csv2sql(csv, {
    createTable,
    inferUnique,
    tableName,
    multilineInsert,
  });

  if (output) {
    const outputDirectory = path.dirname(csvFileName);
    const outputFile = `${outputDirectory}/${tableName}.sql`;
    console.log(chalk.bgHex('#A3BE8C').white(`File: ${outputFile}`));

    fs.writeFileSync(outputFile, generatedSql);
  } else {
    console.log(generatedSql);
  }
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
