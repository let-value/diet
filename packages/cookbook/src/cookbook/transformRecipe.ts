import {
	Recipe,
	Ingredient,
	Measurement,
	unit,
	Quantity,
	Unit,
} from "@/scheme";

import { mapRecipeContainer } from "./recipeContainerExtensions";

export function scaleRecipe(original: Recipe, days: number): Recipe {
	return mapRecipeContainer(original, (node) => {
		if (node instanceof Ingredient && node.quantity) {
			const quantity = node.quantity.mul(days);

			const result = new Ingredient(node);
			result.quantity = quantity;

			return result;
		}

		if (node instanceof Measurement && node.quantity && node.scale) {
			const quantity = node.quantity.mul(days);

			const result = new Measurement(node);
			result.quantity = quantity;

			return result;
		}

		return node;
	}) as Recipe;
}

export function convertRecipeUnits(
	original: Recipe,
	system: "normal" | "us",
): Recipe {
	return mapRecipeContainer(original, (node) => {
		if (node instanceof Ingredient && node.quantity) {
			const quantity = node.quantity.simplify({ system });

			const result = new Ingredient(node);
			result.quantity = quantity;

			return result;
		}

		if (node instanceof Measurement && node.quantity) {
			const quantity = node.quantity.simplify({ system });

			const result = new Measurement(node);
			result.quantity = quantity;

			return result;
		}

		return node;
	}) as Recipe;
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
