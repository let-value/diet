import path from "node:path";
import { writeFile, unlink } from "node:fs/promises";
import { describe, test, expect } from "bun:test";
import os from "os";
import * as everything from "@/.";

import { getEntryPoints, buildDist } from "../../build";
import type { Ingredients as IngredientsContainer } from "@/.";

const entrypoints = getEntryPoints();
const dist = await buildDist(entrypoints);
const blobs: string[] = [];

for (const output of dist.outputs) {
	blobs.push(await output.text());
}

const temp_file = path.join(os.tmpdir(), "temp.js");

try {
	const code = blobs.join("\n");
	await writeFile(temp_file, code);

	const {
		recipes,
		buildCookbook,
		normalizeRecipe,
		findRecipeContainer,
		formatQuantity,
		Ingredients,
	}: typeof everything = await import(temp_file);

	describe("recipes", () => {
		test("normalization", () => {
			const names = Object.values(recipes);

			const normalized = names.map(normalizeRecipe).map((recipe) => {
				const ingredients = findRecipeContainer(
					recipe,
					(node): node is IngredientsContainer => node instanceof Ingredients,
				)?.children.map(
					({ name, quantity }) => `${name} ${formatQuantity(quantity)}`,
				);

				return [recipe.name, ingredients];
			});
			expect(normalized).toMatchSnapshot();
		});
	});

	test("cookbook", () => {
		const { list, groups } = buildCookbook();

		expect(list).toMatchSnapshot();
		expect(groups).toMatchSnapshot();
	});
} finally {
	await unlink(temp_file);
}
