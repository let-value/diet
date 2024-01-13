import {
	Recipe,
	Ingredient,
	Ingredients,
	RecipeContainer,
	parseQuantity,
} from "@/scheme";

import { flattenRecipeContainer } from "./flattenRecipeContainer";
import { add } from "mathjs";
import { Options } from "@/scheme/Options";

function getIngredients(container: RecipeContainer): Ingredient[] {
	const items = Array.from(flattenRecipeContainer(container));

	const ingredients = items.filter(
		(node): node is Ingredient => node instanceof Ingredient,
	);

	return ingredients;
}

export function getIngredientKey({ key, name }: Ingredient) {
	const regex = /\(.*?\)/g;

	if (key) {
		return key;
	}

	const cleanName = name?.replace(regex, "")?.trim();

	return cleanName ?? name?.trim();
}

function combineQuantity(ingredients: Ingredient[]) {
	return ingredients.reduce(
		(acc, { quantity }) => (quantity ? add(acc, quantity) : acc),
		parseQuantity("0g"),
	);
}

function combineOptions(options: Options<string>[]) {
	const set = new Set([].concat(...options));
	return Array.from(set);
}

export function gatherIngredients(recipe: Recipe) {
	const items = Array.from(flattenRecipeContainer(recipe));

	const ingredientsContainer = items.find(
		(node): node is Ingredients => node instanceof Ingredients,
	);

	const mainIngredients = getIngredients(ingredientsContainer);
	const allIngredients = getIngredients(recipe);

	const similar = Object.groupBy(allIngredients, getIngredientKey);

	const result: Ingredient[] = [];

	for (const [key, variants] of Object.entries(similar)) {
		let main = variants.find((ingredient) =>
			mainIngredients.includes(ingredient),
		);

		if (!main) {
			main = variants[0];
		}

		//const others = variants.filter((ingredient) => ingredient !== main);

		const name = main?.name ?? variants.map(({ name }) => name).find(Boolean);
		assertIngredientPart("name", name);

		const quantity = main?.quantity ?? combineQuantity(variants);
		assertIngredientPart("quantity", quantity);

		const category = combineOptions(variants.map(({ category }) => category));
		assertIngredientPart("category", quantity);

		const manipulation = combineOptions(
			variants.map(({ manipulation }) => manipulation),
		);

		const ingredient = new Ingredient({
			key,
			name,
			quantity,
			category,
			manipulation,
		});

		result.push(ingredient);
	}

	return result;
}

/**
 * @throws Missing part for ingredient
 */
function assertIngredientPart(part: string, name: unknown) {
	if (!name) {
		throw new Error(`Missing ${part} for ingredient`);
	}
}
