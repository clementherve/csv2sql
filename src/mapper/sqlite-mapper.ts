import { escapeQuote } from '../helpers/escape-quote';
import GenericMapper, { SpecificMapperInterface } from './generic-mapper';

type SqliteTypes = 'tinyint' | 'int' | 'double' | 'text';

// https://sqlite.org/datatype3.html
export default class SqliteMapper extends GenericMapper implements SpecificMapperInterface {
  private sqliteTypeMapper = {
    tinyint: (value: string) => this.inferGenericTypeFromValue(value) === 'boolean',
    int: (value: string) => this.inferGenericTypeFromValue(value) === 'integer',
    double: (value: string) => this.inferGenericTypeFromValue(value) === 'double',
    text: (value: string) => this.inferGenericTypeFromValue(value) === 'text',
  } as const;

  public DEFAULT_TYPE() {
    return 'text';
  }

  public inferTypeFromValue(value: string) {
    const sqliteTypes = Object.keys(this.sqliteTypeMapper) as SqliteTypes[];
    return sqliteTypes.find((sqliteType) => this.sqliteTypeMapper[sqliteType](value)) ?? 'text';
  }

  public mapValueAccordingToType(value: string, type: SqliteTypes) {
    if (type === 'int' || type === 'double') {
      return escapeQuote(value);
    } else if (type === 'tinyint') {
      return value.trim().toLowerCase() === 'true' ? 1 : 0;
    } else {
      return escapeQuote(value);
    }
  }

  public getCheckingFunctionForType(type: SqliteTypes) {
    return this.sqliteTypeMapper[type];
  }
}
