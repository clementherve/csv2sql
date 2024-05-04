interface DbTypes {
  _null: string;
  _boolean: string;
  _number: string;
  _text: string;
}
// sqlite
const SqliteTypes = {
  _null: 'null',
  _boolean: 'integer',
  _number: 'integer',
  _text: 'text',
} satisfies DbTypes;

// psql
const PsqlTypes = {
  _null: 'null',
  _boolean: 'boolean',
  _number: 'integer',
  _text: 'text',
} satisfies DbTypes;

// mssql
const MssqlTypes = {
  _null: '',
  _boolean: 'boolean',
  _number: 'integer',
  _text: 'text',
};