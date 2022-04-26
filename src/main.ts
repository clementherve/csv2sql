import chalk from 'chalk'
import fs from 'fs'
import { csv2sql } from './csv2sql.js'
import path from 'path'
import { ArgumentParser } from 'argparse';

const parser = new ArgumentParser();

parser.add_argument('-t', '--infer-type', { 'nargs': '*' });
parser.add_argument('-u', '--infer-unique', { 'nargs': '*' });
parser.add_argument('-m', '--multiline-insert', { 'nargs': '*' });
parser.add_argument('-s', '--schema');
parser.add_argument('');

const args = parser.parse_args();
const csvFile = args[''];
const inferTypes = args['infer_type'] != undefined;
const inferUnique = args['infer_unique'] != undefined;
const multilineInsert = args['multiline_insert'] != undefined;
const DBSchema = args['schema'];

// console.log(inferTypes);
// console.log(inferUnique);
// console.log(multilineInsert);
// console.log(DBSchema);

const tablename = path.basename(csvFile,'.csv').replace(/[\s-]+/g, "_");
const outputDirectory = path.dirname(csvFile);
const outputFile = `${outputDirectory}/${tablename}.sql`;

if (!fs.existsSync(csvFile)) {
  console.log(chalk.bold.red('Could not find the CSV file'));
  process.exit(-1);
}

if (DBSchema == undefined) {
  console.log(chalk.yellow('No SQL table creation file provided, I will create it from CSV header...'));
} else {
  if (inferTypes || inferUnique) {
    console.log(chalk.yellow('Both schema inference and schema were provided. Provided schema will supercede the inferences'));
  }

  if (!fs.existsSync(DBSchema)) {
    console.log(chalk.bold.red('Could not find the SQL schema file'));
    process.exit(-1);
  }
}

const schema = DBSchema != undefined ? fs.readFileSync(DBSchema, 'utf-8') : undefined;

(async () => {
  console.log(chalk.grey(`- Reading ${csvFile}...`));
  const csv = fs.readFileSync(csvFile, 'utf-8');
  const SQL = await csv2sql(csv, tablename, false, schema);

  console.log(chalk.grey(`- Finished SQL generation`));
  console.log(chalk.bgHex('#A3BE8C').white(`File: ${outputFile}`));
  fs.writeFileSync(outputFile, SQL);
})()

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