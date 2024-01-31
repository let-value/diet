import { describe, test, expect } from "bun:test";

import { Ingredient } from "@/scheme";
import { test_recipe } from "@/test/recipe.test";

import { scaleRecipe, convertRecipeUnits } from "../transformRecipe";
import { filterRecipeContainer } from "../recipeContainerExtensions";

test("scaleRecipe", () => {
	const recipe = scaleRecipe(test_recipe, 5);

	const ingredients = filterRecipeContainer(
		recipe,
		(node): node is Ingredient => node instanceof Ingredient,
	);

	const quantities = ingredients
		.map(({ quantity }) => quantity)
		.filter(Boolean)
		.map((quantity) => quantity.toString())
		.toSorted();

	expect(quantities).toEqual(["10 kg", "100 slices", "5", "5 g", "5 tsp"]);
});

describe("convertRecipeUnits", () => {
	test("convert to si", () => {
		const recipe = convertRecipeUnits(test_recipe, "si");

		const ingredients = filterRecipeContainer(
			recipe,
			(node): node is Ingredient => node instanceof Ingredient,
		);

		const quantities = ingredients
			.map(({ quantity }) => quantity)
			.filter(Boolean)
			.map((quantity) => quantity.toString({ precision: 2 }))
			.toSorted();

		expect(quantities).toEqual(["1", "1 g", "1 tsp", "2 kg", "20 slices"]);
	});

	test("convert to us", () => {
		const recipe = convertRecipeUnits(test_recipe, "us");

		const ingredients = filterRecipeContainer(
			recipe,
			(node): node is Ingredient => node instanceof Ingredient,
		);

		const quantities = ingredients
			.map(({ quantity }) => quantity)
			.filter(Boolean)
			.map((quantity) => quantity.toString({ precision: 2 }))
			.toSorted();

		expect(quantities).toEqual([
			"0.0022 lbm",
			"1",
			"1 tsp",
			"20 slices",
			"4.4 lbm",
		]);
	});
});
