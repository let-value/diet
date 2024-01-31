import { test, expect } from "bun:test";

import { Ingredients, Ingredient, RecipeContainer } from "@/scheme";
import { test_recipe } from "@/test/recipe.test";
import {
	flattenRecipeContainer,
	findRecipeContainer,
	filterRecipeContainer,
	mapRecipeContainer,
} from "../recipeContainerExtensions";
import { groupBy } from "../utils";

test("flattenRecipeContainer", () => {
	const array = flattenRecipeContainer(test_recipe);

	const groups = groupBy(array, (node) => {
		if (typeof node === "object") {
			return node.constructor.name;
		}

		return typeof node;
	});

	expect(
		Object.fromEntries(
			Object.entries(groups).map(([key, items]) => [key, items.length]),
		),
	).toEqual({
		Recipe: 1,
		Ingredients: 1,
		Ingredient: 8,
		Measurement: 3,
		Preparation: 1,
		Step: 6,
		string: 15,
		Directions: 1,
	});
});

test("findRecipeContainer", () => {
	const container = findRecipeContainer(
		test_recipe,
		(node): node is Ingredients => node instanceof Ingredients,
	);

	expect(container).toBeInstanceOf(Ingredients);
});

test("filterRecipeContainer", () => {
	const containers = filterRecipeContainer(
		test_recipe,
		(node): node is Ingredient => node instanceof Ingredient,
	);

	expect(containers).toHaveLength(8);
});

test("mapRecipeContainer", () => {
	const mapped = mapRecipeContainer(test_recipe, (node) => {
		if (node instanceof Ingredient) {
			return new Ingredient({ ...node, name: "mapped" });
		}

		return node;
	}) as RecipeContainer;

	const ingredients = filterRecipeContainer(
		mapped,
		(node): node is Ingredient => node instanceof Ingredient,
	);

	expect(ingredients).toHaveLength(8);
	expect(Array.from(new Set(ingredients.map(({ name }) => name)))).toEqual([
		"mapped",
	]);
});
