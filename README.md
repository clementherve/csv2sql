# csv-to-sql-js
Create a MySQL table from any CSV using Node.js script.

## Setup

1. From a linux shell terminal install node and npm.  
<https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/>

2. Clone repo and install the required packages.  

```shell
git clone git@github.com:mortie23/csv-to-sql-js.git
npm init
npm install csvtojson@latest --save
npm install fs@latest --save
```

## Usage

1. Run the following command and the `inserts.sql` file should be generated.

```shell
./index.js data-classes.csv myschema
```
