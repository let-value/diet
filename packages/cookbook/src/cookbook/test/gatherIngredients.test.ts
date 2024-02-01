import { describe, test, expect } from "bun:test";

import { Plan } from "@/scheme";

import { test_recipe, exotic_recipe } from "@/test/recipe.test";
import { getIngredientKey, gatherIngredients } from "../gatherIngredients";

test("getIngredientKey", () => {
	expect(getIngredientKey({ name: "name" })).toBe("name");
	expect(getIngredientKey({ key: "key", name: "name" })).toBe("key");
	expect(getIngredientKey({ name: "name (description)" })).toBe("name");
});

describe("gatherIngredients", () => {
	test("test_recipe", () => {
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

	test("exotic_recipe", () => {
		const { children: ingredients } = gatherIngredients(exotic_recipe);

		expect(ingredients).toHaveLength(7);

		expect(ingredients.map(({ key }) => key)).toEqual([
			"dragon fruit",
			"mango",
			"kiwi",
			"pomegranate seeds",
			"fresh mint leaves",
			"lime juice",
			"honey",
		]);

		expect(ingredients.map(({ name }) => name)).toEqual([
			"dragon fruit",
			"mango",
			"kiwi",
			"pomegranate seeds",
			"fresh mint leaves",
			"lime juice",
			"honey",
		]);

		expect(
			ingredients.map(({ quantity }) => quantity.simplify().toString()),
		).toEqual(["2", "1", "3", "1 cup", "0 g", "2 tbsp", "1 tbsp"]);

		expect([
			...new Set(ingredients.flatMap(({ category }) => category)),
		]).toEqual(["fruit", "herb", "liquid", "sweetener"]);
	});

	test("plan", () => {
		const plan = new Plan({ children: [test_recipe, exotic_recipe] });
		const { children: ingredients } = gatherIngredients(plan);

		expect(ingredients).toHaveLength(12);

		expect(ingredients.map(({ key }) => key)).toEqual([
			"ingredient1",
			"ingredient2",
			"ingredient3",
			"ingredient4",
			"ingredient5",
			"dragon fruit",
			"mango",
			"kiwi",
			"pomegranate seeds",
			"fresh mint leaves",
			"lime juice",
			"honey",
		]);

		expect(ingredients.map(({ name }) => name)).toEqual([
			"ingredient1",
			"ingredient2 (raw)",
			"Fresh ingredient 3",
			"ingredient4",
			"ingredient5",
			"dragon fruit",
			"mango",
			"kiwi",
			"pomegranate seeds",
			"fresh mint leaves",
			"lime juice",
			"honey",
		]);

		expect(
			ingredients
				.map(({ quantity }) => quantity.simplify().toString())
				.toSorted(),
		).toEqual([
			"0 g",
			"1",
			"1",
			"1 cup",
			"1 g",
			"1 tbsp",
			"1 tsp",
			"2",
			"2 tbsp",
			"20 slices",
			"2000 g",
			"3",
		]);

		expect(ingredients.flatMap(({ category }) => category)).toEqual([
			"category1",
			"category2",
			"category3",
			"category4",
			"category5",
			"fruit",
			"fruit",
			"fruit",
			"fruit",
			"herb",
			"liquid",
			"sweetener",
		]);
	});
});
