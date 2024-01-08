import { Recipe, RecipeContainer, Ingredient } from "@/scheme";

export function* flattenRecipeContainer(
	container: RecipeContainer,
): Generator<unknown> {
	yield container;

	for (const child of container.children) {
		yield child;

		if (child instanceof RecipeContainer) {
			yield* flattenRecipeContainer(child);
		}
	}
}

export function normalizeRecipe(recipe: Recipe) {
	const items = Array.from(flattenRecipeContainer(recipe));

	const ingredients = items
		.filter((node) => node instanceof Ingredient)
		.map((ingredient) => ingredient);

	return {
		...recipe,
		ingredients,
	};
}
