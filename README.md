# csv-to-sql-js
Create a MySQL table from any CSV using Node.js script.

## Setup

```bash
    git clone https://github.com/clementherve/csv-to-sql-js.git
    npm i
    npm run build
```

### Testing
```
    npm run test
```

## Usage

Run the following command and the SQL file should be generated.

```bash
    node ./out/main.js <csv file> [sql table creation file]
```

### Example
The following file: `./example/example.csv`
```csv
A; B; C; D
0; 1; 2; hey
1; 1; 3; hoy
2; 2; 5; h'ay
```

Will be transformed to:
```sql
drop table if exists `example`; 
create table if not exists `example` (
	`A` int, 
	`B` int, 
	`C` int, 
	`D` text
); 
insert into `example` 
	(`A`, `B`, `C`, `D`)
 values 
	(0, 1, 2, 'hey'), 
	(1, 1, 3, 'hoy'), 
	(2, 2, 5, 'h\'ay');
```