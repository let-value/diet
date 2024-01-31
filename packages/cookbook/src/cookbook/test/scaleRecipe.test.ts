import { test, expect } from "bun:test";

import { Ingredient } from "@/scheme";
import { test_recipe } from "@/test/recipe.test";

import { scaleRecipe } from "../scaleRecipe";
import { filterRecipeContainer } from "../recipeContainerExtensions";

test("scaleRecipe", () => {
	const recipe = scaleRecipe(test_recipe, 2000);

	const ingredients = filterRecipeContainer(
		recipe,
		(node): node is Ingredient => node instanceof Ingredient,
	);

	expect(
		ingredients
			.map(({ quantity }) => quantity)
			.filter(Boolean)
			.map((quantity) =>
				quantity
					.simplify({
						autoPrefix: true,
						prefixMin: 1000,
					})
					.toString(),
			)
			.toSorted(),
	).toEqual(["2000", "2000 g", "2000 tsp", "4000 kg", "40000 slices"]);
});
