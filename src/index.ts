import * as scheme from "./scheme";
Object.assign(globalThis, scheme);

const recepies = new Map<string, scheme.Recipe>();

export { recepies };
