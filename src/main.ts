
const chalk = require('chalk');
const csv2sql = require('./csv2sql');
const fs = require("fs");
const path = require("path");

const csvFile: string = process.argv[2];
const tablename = path.basename(csvFile,'.csv').replace(/[\s-]+/g, "_");
const outputDirectory = path.dirname(csvFile);
const outputFile = `${outputDirectory}/${tablename}.sql`;
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
  console.log(chalk.yellow('No SQL table creation file provided, I will create it from CSV header...'));
}


(async () => {
  console.log(chalk.grey(`- Reading ${csvFile}...`));
  const csv = fs.readFileSync(csvFile, 'utf-8');
  const SQL = await csv2sql(csv, tablename, DBSchema);
  
  console.log(chalk.grey(`- Finished SQL generation`));
  console.log(chalk.bgHex('#A3BE8C').white(`File: ${outputFile}`));
  fs.writeFileSync(outputFile, SQL);
})()