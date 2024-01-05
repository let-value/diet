import { build, write, Glob } from "bun";
import path from "path";
import { recipePlugin } from "./recipePlugin";

const glob = new Glob("./src/recipes/*");
const recipes = glob.scanSync({ cwd: "./" });

const entrypoints = ["./src/index.ts", ...recipes, "./src/cookbook.ts"];

const results = await build({
	entrypoints,
	plugins: [recipePlugin],
	target: "node",
});

if (!results.success) {
	console.log(results);
	process.exit(1);
}

const result: BlobPart[] = [];

for (const output of results.outputs) {
	result.push(await output.arrayBuffer());
}

await write(path.join("dist", "index.js"), result);
