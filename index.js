#!/usr/bin/node
// Author:  Christopher Mortimer
// Date:    2020-01-07
// Desc:    Create a MySQL table from a CSV
// Dep:     npm install csvtojson@latest --save
//          npm install fs@latest --save
// Usage:   ./index.js csvfile dbschema
// Example: ./index.js ./data-classes.csv mysql_schema

// Process arguments
const csvfile = process.argv[2];
const dbschema = process.argv[3];

// Require packages
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');
// Parse the filename for the tablename
const tablename = path.basename(csvfile,'.csv').replace(/[\s-]+/g, "_");
const sqlScript = "./"+tablename+".sql";

// Log the arguments
console.log('csvfile: '+csvfile+' dbschema: '+dbschema+' tablename: '+tablename);

// Convert a csv file with csvtojson
csvtojson()
  .fromFile(csvfile)
  .then(function (jsonArrayObj) {
    // Get list of keys (columns)
    var keys = Object.keys(jsonArrayObj[0]);

    dropCreate = generateDDL(keys);
    fs.writeFileSync(sqlScript, dropCreate);

    // Generate the list of columns in the insert statement
    fs.appendFileSync(sqlScript, "insert into "+dbschema+"."+tablename+" (");
    for (var j = 0; j < keys.length; j++) {
      if (j === 0) {
        fs.appendFileSync(sqlScript, keys[j]);
      } else {
        fs.appendFileSync(sqlScript, ',' + keys[j]);
      }
    }
    fs.appendFileSync(sqlScript, ") \n values ");
    // Generate the values in the insert statement
    for (var i = 0; i < jsonArrayObj.length; i++) {
      var obj = jsonArrayObj[i];
      if (i === 0) {
        fs.appendFileSync(sqlScript, '\n(')
      } else {
        fs.appendFileSync(sqlScript, '\n,(')
      }
      // comma seperated list of single quoted values (escape single quotes with two single quotes)
      for (var k = 0; k < keys.length; k++) {
        var colValue = obj[keys[k]].replace(new RegExp("'", "g"), "''");
        if (k === 0) {
          fs.appendFileSync(sqlScript, "'" + colValue + "'");
        } else {
          fs.appendFileSync(sqlScript, "," + "'" + colValue + "'");
        }
      }
      fs.appendFileSync(sqlScript, ')')
    }
    fs.appendFileSync(sqlScript, "; ");
  })

function generateDDL(keys) {
  // Column definition for the table
  const idcol = 'id int not null AUTO_INCREMENT';
  const primaryKeyDefinition = ', PRIMARY KEY (id)';
    ;
  // Drop create statement
  const dropStatement = "drop table if exists "+dbschema+"."+tablename+";";
  const createHeader = "create table "+dbschema+"."+tablename+" (";
  const createFooter = ');';
  var colDef = '';
  for (var j = 0; j < keys.length; j++) {
    colDef = colDef+','+keys[j]+' varchar(100)\n'
  }
  return dropStatement+'\n'+createHeader+'\n'+idcol+'\n'+colDef+'\n'+primaryKeyDefinition+'\n'+createFooter;
}
