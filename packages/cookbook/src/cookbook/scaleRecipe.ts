import { Recipe, Ingredient, unit } from "@/scheme";

import { mapRecipeContainer } from "./recipeContainerExtensions";

export function scaleRecipe(original: Recipe, days: number): Recipe {
	return mapRecipeContainer(original, (node) => {
		if (node instanceof Ingredient && node.quantity) {
			const quantity = node.quantity.mul(unit(`${days}`));

			return new Ingredient({
				...node,
				quantity,
			});
		}

		return node;
	}) as Recipe;
}
