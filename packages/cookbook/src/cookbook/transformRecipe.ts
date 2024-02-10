import {
	Ingredient,
	Measurement,
	Quantity,
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

const timeUnits = {
	day: 86400,
	hour: 3600,
	minute: 60,
};

function formatTime(quantity: Quantity): string {
	let seconds = quantity.to("second").getValue();
	let result = "";

	if (seconds >= timeUnits.day) {
		const days = Math.floor(seconds / timeUnits.day);
		result += `${days} d `;
		seconds %= timeUnits.day;
	}

	if (seconds >= timeUnits.hour) {
		const hours = Math.floor(seconds / timeUnits.hour);
		result += `${hours} h `;
		seconds %= timeUnits.hour;
	}

	if (seconds >= timeUnits.minute) {
		const minutes = Math.floor(seconds / timeUnits.minute);
		result += `${minutes} m `;
		seconds %= timeUnits.minute;
	}

	if (seconds > 0) result += `${seconds} s`;

	return result.trim();
}

export function formatQuantity(
	quantity: Quantity,
	{
		simplify = { prefixMin: 1, prefixMax: 100 },
		format = { precision: 2 },
	}: {
		simplify?: Parameters<Unit["simplify"]>[0];
		format?: Parameters<Unit["toString"]>[0];
	} = {},
) {
	if (Object.keys(quantity.dimension).includes("TIME")) {
		return formatTime(quantity);
	}

	return quantity.simplify(simplify).toString(format);
}

function assertValidQuantity(quantity: Unit, message = "") {
	const value = quantity.getValue();
	if (Number.isNaN(value)) {
		throw new QuantityAssertionError(`not valid quantity message: ${message}`);
	}
}
