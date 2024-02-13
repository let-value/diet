import { Recipe, Preparation, Directions, Plan } from "@/scheme";

import { gatherIngredients } from "./gatherIngredients";
import { findRecipeContainer } from "./recipeContainerExtensions";

export function normalizeRecipe(original: Recipe): Recipe {
	try {
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
			children: [ingredients, preparation, directions].filter(Boolean),
		});
	} catch (error) {
		throw new Error(`Error normalizing recipe ${original.name}`, {
			cause: error,
		});
	}
}

export function createPlan(recipes: (Recipe | undefined | null)[]) {
	const children = recipes.filter(Boolean).map(normalizeRecipe);
	return new Plan({ children });
}
