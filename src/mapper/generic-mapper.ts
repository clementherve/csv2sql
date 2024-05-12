export type TypeMapper = {
  [type in string]: (value: string, ...args: any) => boolean;
};

export interface SpecificMapperInterface {
  inferTypeFromValue: (value: string) => string;
  getCheckingFunctionForType: (type: any) => (value: string) => boolean;
  DEFAULT_TYPE: () => string;
}

export interface GenericMapperInterface {
  typeIsConsistantAcrossValues: (values: string[], type: string, mapper: SpecificMapperInterface) => boolean;
}

export default class GenericMapper implements GenericMapperInterface {
  private genericTypes = ['double', 'integer', 'boolean', 'text', 'date', 'time', 'object'] as const;

  private genericTypeChecking = {
    double: (value: string) => Number.parseFloat(value).toString() !== 'NaN' && value.includes('.'),
    integer: (value: string) => Number.parseInt(value).toString() !== 'NaN' && !value.includes('.'),
    boolean: (value: string) => value.toLowerCase() === 'true' || value.toLowerCase() === 'false',
    date: (_: string) => false,
    time: (_: string) => false,
    object: (_: string) => false,
    text: (_: string) => true,
  } satisfies TypeMapper;

  protected inferGenericTypeFromValue(value: string) {
    return this.genericTypes.find((type) => this.genericTypeChecking[type](value)) ?? 'text';
  }

  public typeIsConsistantAcrossValues(values: string[], type: string, mapper: SpecificMapperInterface) {
    return values.every((value) => mapper.getCheckingFunctionForType(type)(value));
  }
}
