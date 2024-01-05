import * as scheme from "./scheme";
Object.assign(globalThis, scheme);

const recipes = new Map<string, scheme.Recipe>();

export { recipes };
