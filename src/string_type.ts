
module.exports  = (value: string): string => {
    const types: {[index: string] : ((val: string) => Boolean)} = {
        'double': (value: string) => Number.parseFloat(value).toString() != 'NaN' && value.includes('.'),
        'int': (value: string) => Number.parseInt(value).toString() != 'NaN' && !value.includes('.'),
        'bool': (value: string) => value.toLowerCase() == 'true' || value.toLowerCase() == 'false',
        'string': (value: string) => true
    }

    return Object.keys(types).find((type: string) => {
        return types[type](value);
    }) ?? 'string';
}
