import { RecipeContainer } from "@/scheme";

export function flattenRecipeContainer(container: RecipeContainer) {
	const result: unknown[] = [container];

	for (const child of container.children) {
		if (child instanceof RecipeContainer) {
			result.push(...flattenRecipeContainer(child));
		} else {
			result.push(child);
		}
	}

	return result;
}

export function findRecipeContainer<S = unknown>(
	container: RecipeContainer,
	predicate: (node: unknown) => node is S,
): S | undefined {
	for (const child of container.children) {
		if (predicate(child)) {
			return child;
		}

		if (child instanceof RecipeContainer) {
			const found = findRecipeContainer(child, predicate);
			if (found) {
				return found;
			}
		}
	}

	return null;
}

export function filterRecipeContainer<S = unknown>(
	container: RecipeContainer,
	predicate: (node: unknown) => node is S,
): S[] {
	const found: S[] = [];

	for (const child of container.children) {
		if (predicate(child)) {
			found.push(child);
		}

		if (child instanceof RecipeContainer) {
			found.push(...filterRecipeContainer(child, predicate));
		}
	}

	return found;
}

export function mapRecipeContainer<TContainer extends RecipeContainer>(
	container: TContainer,
	map: (node: unknown) => unknown,
) {
	let mapped = map(container);

	if (!(mapped instanceof RecipeContainer)) {
		return mapped;
	}

	mapped = map(
		Object.assign(Object.create(Object.getPrototypeOf(container)), container),
	);

	(mapped as RecipeContainer).children = container.children.map((child) => {
		if (child instanceof RecipeContainer) {
			return mapRecipeContainer(child, map);
		}

		return map(child);
	});

	return mapped;
}
