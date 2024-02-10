import path from "node:path";
import { writeFile, unlink } from "node:fs/promises";
import { describe, test, expect } from "bun:test";
import os from "os";
import * as everything from "@/.";

import { getEntryPoints, buildDist } from "../../build";

const entrypoints = getEntryPoints();
const dist = await buildDist(entrypoints);
const blobs: string[] = [];

for (const output of dist.outputs) {
	blobs.push(await output.text());
}

test("blobs", () => {
	expect(blobs).toHaveLength(4);
});

const temp_file = path.join(os.tmpdir(), "temp.js");

try {
	const code = blobs.join("\n");
	await writeFile(temp_file, code);

	const { recipes, buildCookbook, normalizeRecipe }: typeof everything =
		await import(temp_file);

	describe("recipes", () => {
		test("names", () => {
			const names = Object.keys(recipes);
			expect(names).toHaveLength(3);
			expect(names).toMatchSnapshot();
		});

		test("normalization", () => {
			const names = Object.values(recipes);
			const normalized = names.map(normalizeRecipe);
			expect(normalized).toHaveLength(3);
		});
	});

	describe("cookbook", () => {
		const cookbook = buildCookbook();
	});
} finally {
	await unlink(temp_file);
}
