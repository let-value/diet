import {
	Ingredient,
	Measurement,
	Unit,
	RecipeContainer,
	QuantityAssertionError,
} from "@/scheme";

import { mapRecipeContainer } from "./recipeContainerExtensions";

export function scaleRecipe<TContainer extends RecipeContainer>(
	original: TContainer,
	days: number,
): TContainer {
	return mapRecipeContainer(original, (node) => {
		if (node instanceof Ingredient && node.quantity) {
			const quantity = node.quantity.mul(days);

			assertValidQuantity(
				quantity,
				`multiply ${node.quantity.toString()} by ${days}`,
			);

			const result = new Ingredient(node);
			result.quantity = quantity;

			return result;
		}

		if (node instanceof Measurement && node.quantity && node.scale) {
			const quantity = node.quantity.mul(days);

			assertValidQuantity(
				quantity,
				`multiply ${node.quantity.toString()} by ${days}`,
			);

			const result = new Measurement(node);
			result.quantity = quantity;

			return result;
		}

		return node;
	}) as TContainer;
}

export function convertRecipeUnits<TContainer extends RecipeContainer>(
	original: TContainer,
	system: "normal" | "us",
): TContainer {
	return mapRecipeContainer(original, (node) => {
		if (node instanceof Ingredient && node.quantity) {
			const quantity = node.quantity.simplify({ system });

			assertValidQuantity(
				quantity,
				`convert ${node.quantity.toString()} to ${system}`,
			);

			const result = new Ingredient(node);
			result.quantity = quantity;

			return result;
		}

		if (node instanceof Measurement && node.quantity) {
			const quantity = node.quantity.simplify({ system });

			assertValidQuantity(
				quantity,
				`convert ${node.quantity.toString()} to ${system}`,
			);

			const result = new Measurement(node);
			result.quantity = quantity;

			return result;
		}

		return node;
	}) as TContainer;
}

function assertValidQuantity(quantity: Unit, message = "") {
	const value = quantity.getValue();
	if (Number.isNaN(value)) {
		throw new QuantityAssertionError(`not valid quantity message: ${message}`);
	}
}
