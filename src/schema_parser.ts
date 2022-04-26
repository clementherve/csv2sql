
type column = {
    'type': string,
    'unique': boolean,
    'primary': boolean,
    'foreign': boolean,
    'not_null': boolean
}
type schema = {
    [collName: string]: column
}
const schemaParser = async (schema: string): Promise<schema> => {
    console.log(schema);
    return {}
}


export { schemaParser }