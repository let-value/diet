import { Recipe, Preparation, Directions } from "@/scheme";

import { gatherIngredients } from "./gatherIngredients";
import { findRecipeContainer } from "./recipeContainerExtensions";

export function normalizeRecipe(original: Recipe): Recipe {
	const ingredients = gatherIngredients(original);

	const preparation = findRecipeContainer(
		original,
		(node): node is Preparation => node instanceof Preparation,
	);

	const directions = findRecipeContainer(
		original,
		(node): node is Directions => node instanceof Directions,
	);

	return new Recipe({
		name: original.name ?? "",
		meal: original.meal,
		servings: original.servings,
		children: [ingredients, preparation, directions],
	});
}
