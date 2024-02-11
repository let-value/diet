import {
	Ingredient,
	Ingredients,
	RecipeContainer,
	Options,
	assertValidQuantity,
	parseQuantity,
} from "@/scheme";

import {
	filterRecipeContainer,
	findRecipeContainer,
} from "./recipeContainerExtensions";
import { groupBy } from "./utils";

function getIngredients(container: RecipeContainer): Ingredient[] {
	return filterRecipeContainer(
		container,
		(node): node is Ingredient => node instanceof Ingredient,
	);
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
	const result = ingredients
		.map(({ quantity }) => quantity?.clone())
		.reduceRight((acc = parseQuantity("0g"), quantity = undefined) =>
			quantity ? acc.add(quantity) : acc,
		);

	assertValidQuantity(result, "combine quantity");

	return result;
}

function combineOptions(options: Options<string>[]) {
	const set = new Set<string>(options.flat());
	return Array.from(set);
}

/**
 * @inheritdoc assertIngredientPart
 */
export function gatherIngredients(recipe: RecipeContainer) {
	const ingredientsContainer = findRecipeContainer(
		recipe,
		(node): node is Ingredients => node instanceof Ingredients,
	);

	const mainIngredients = getIngredients(ingredientsContainer);
	const allIngredients = getIngredients(recipe);

	const similar = groupBy(allIngredients, getIngredientKey);

	const children: Ingredient[] = [];

	for (const [key, variants] of Object.entries(similar))
		try {
			let main = variants.find((ingredient) =>
				mainIngredients.includes(ingredient),
			);

			if (!main) {
				main = variants[0];
			}

			const name = main?.name ?? variants.map(({ name }) => name).find(Boolean);
			assertIngredientPart("name", name, key);

			const quantity = main?.quantity?.clone() ?? combineQuantity(variants);
			assertIngredientPart("quantity", quantity, name);
			assertValidQuantity(quantity, `quantity for ingredient ${name}`);

			const category = combineOptions(variants.map(({ category }) => category));
			assertIngredientPart("category", category, name);

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

			children.push(ingredient);
		} catch (error) {
			throw new Error(`Error combining ingredient "${key}"`, { cause: error });
		}

	return new Ingredients({ children });
}

/**
 * @throws Missing part for ingredient
 */
function assertIngredientPart(part: string, name: unknown, ingredient: string) {
	if (!name) {
		throw new Error(`Missing ${part} for ingredient ${ingredient}`);
	}
}
