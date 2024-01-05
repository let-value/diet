import * as schema from "schema";
Object.assign(globalThis, schema);

const recepies = new Map<string, schema.Recipe>();

export { recepies };
