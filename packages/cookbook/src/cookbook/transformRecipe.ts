import { Recipe, Ingredient, unit } from "@/scheme";

import { mapRecipeContainer } from "./recipeContainerExtensions";

export function scaleRecipe(original: Recipe, days: number): Recipe {
	return mapRecipeContainer(original, (node) => {
		if (node instanceof Ingredient && node.quantity) {
			const quantity = node.quantity.mul(unit(`${days}`));

			const result = new Ingredient(node);
			result.quantity = quantity;

			return result;
		}

		return node;
	}) as Recipe;
}

export function convertRecipeUnits(
	original: Recipe,
	system: "si" | "us",
): Recipe {
	return mapRecipeContainer(original, (node) => {
		if (node instanceof Ingredient && node.quantity) {
			const quantity = node.quantity.simplify({ system });

			const result = new Ingredient(node);
			result.quantity = quantity;

			return result;
		}

		return node;
	}) as Recipe;
}
