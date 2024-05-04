![CodeQL](https://github.com/clementherve/csv2sql/actions/workflows/codeql.yml/badge.svg)

# CSV2SQL

Create a MySQL table from any CSV using javascript.

## Setup

```bash
    git clone https://github.com/clementherve/csv2sql.git
    pnpm i
    npm run build
```

### Testing

```
    npm run tests
```

## Usage

Run the following command and the SQL file should be generated.

```bash
    node ./out/src/cli.js <csv file>
	// or
	bun ./src/cli.ts
```

### Example

The file `./example/example.csv`

```csv
A; B; C; D
0; 1; 2; hoy
; 1; 3; hoy
2; 2; 5; h'ay
```

will be transformed to

```sql
drop table if exists `example`;
create table if not exists `example` (
	`A` int unique,
	`B` int not null,
	`C` int unique not null,
	`D` text not null
);
insert into `example`
	(`A`, `B`, `C`, `D`)
 values
	(0, 1, 2, 'hoy'),
	(null, 1, 3, 'hoy'),
	(2, 2, 5, 'h\'ay');
```
