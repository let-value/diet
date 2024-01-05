import * as scheme from "./scheme";
Object.assign(globalThis, scheme);

const recipes: Record<string, scheme.Recipe> = {};

export { recipes };
