import { test, expect } from "bun:test";

import { test_recipe } from "@/test/recipe.test";
import { getIngredientKey, gatherIngredients } from "../gatherIngredients";

test("getIngredientKey", () => {
	expect(getIngredientKey({ name: "name" })).toBe("name");
	expect(getIngredientKey({ key: "key", name: "name" })).toBe("key");
	expect(getIngredientKey({ name: "name (description)" })).toBe("name");
});

test("gatherIngredients", () => {
	const { children: ingredients } = gatherIngredients(test_recipe);

	expect(ingredients).toHaveLength(5);

	expect(ingredients.map(({ key }) => key)).toEqual([
		"ingredient1",
		"ingredient2",
		"ingredient3",
		"ingredient4",
		"ingredient5",
	]);

	expect(ingredients.map(({ name }) => name)).toEqual([
		"ingredient1",
		"ingredient2 (raw)",
		"Fresh ingredient 3",
		"ingredient4",
		"ingredient5",
	]);

	expect(
		ingredients.map(({ quantity }) => quantity.simplify().toString()),
	).toEqual(["1 g", "2000 g", "20 slices", "1 tsp", "1"]);

	expect(ingredients.flatMap(({ category }) => category)).toEqual([
		"category1",
		"category2",
		"category3",
		"category4",
		"category5",
	]);
});
