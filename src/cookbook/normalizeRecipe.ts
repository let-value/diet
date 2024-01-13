import { Recipe } from "@/scheme";

import { gatherIngredients } from "./gatherIngredients";

export function normalizeRecipe(recipe: Recipe) {
	const ingredients = gatherIngredients(recipe);

	return {
		recipe,
		ingredients,
	};
}
