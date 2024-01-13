import { RecipeContainer } from "@/scheme";

export function* flattenRecipeContainer(
	container: RecipeContainer,
): Generator<unknown> {
	yield container;

	for (const child of container.children) {
		if (child instanceof RecipeContainer) {
			yield* flattenRecipeContainer(child);
		} else {
			yield child;
		}
	}
}
