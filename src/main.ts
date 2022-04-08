
const chalk = require('chalk');
const csv2sql = require('./csv2sql');
const Fs = require('fs');

const csvFile: string = process.argv[2];
const DBSchema: string = process.argv[3];



if (csvFile == undefined) {
  console.log(chalk.bold.red('Please provide a CSV file'));
  process.exit(-1);
}

if (!fs.existsSync(csvFile)) {
  console.log(chalk.bold.red('Could not find the CSV file'));
  process.exit(-1);
}

if (DBSchema == undefined) {
  console.log(chalk.green('No table schema provided, will infer it from csv header...'));
}

csv2sql(csvFile, DBSchema);