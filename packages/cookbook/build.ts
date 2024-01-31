import { build, write, Glob, readableStreamToText, BuildOutput } from "bun";
import path from "path";
import { recipePlugin } from "./recipePlugin";

export const DIST_PATH = "dist";

async function buildTypings() {
	const { stdout } = Bun.spawn(["tsc"]);
	const text = await readableStreamToText(stdout);
	console.log(text);
}

function getEntryPoints() {
	const glob = new Glob("./src/recipes/*.tsx");
	const recipes = glob.scanSync({ cwd: "./" });

	return ["./src/index.ts", ...recipes];
}

async function buildDist(entrypoints: string[]) {
	const buildOutput = await build({
		entrypoints,
		plugins: [recipePlugin],
		target: "node",
	});

	return buildOutput;
}

async function writeDist(buildOutput: BuildOutput) {
	const result: BlobPart[] = [];

	for (const output of buildOutput.outputs) {
		result.push(await output.arrayBuffer());
	}

	await write(path.join(DIST_PATH, "index.js"), result);
}

export async function buildCookbook() {
	try {
		await buildTypings();
		const entrypoints = getEntryPoints();
		const outputs = await buildDist(entrypoints);

		if (outputs.success) {
			console.log("Build successful!");
			await writeDist(outputs);
		} else {
			console.error("Build failed!");
			console.log(outputs);
		}

		return outputs.success;
	} catch (e) {
		console.error(e);
	}
}

if (import.meta.main) {
	const success = await buildCookbook();
	process.exit(success ? 0 : 1);
}
