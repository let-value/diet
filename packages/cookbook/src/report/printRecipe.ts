import {
	RecipeContainer,
	RecipeContainerProps,
	Recipe,
	Ingredients,
	Preparation,
	Directions,
	Step,
	Ingredient,
	Measurement,
} from "@/scheme";

import { formatQuantity } from "@/cookbook/formatQuantity";

interface TextRecipeContainerProps
	extends RecipeContainerProps<TextRecipeContainer> {
	text: string;
}

class TextRecipeContainer extends RecipeContainer<TextRecipeContainer> {
	text: string;

	constructor(props: TextRecipeContainerProps) {
		super(props);

		this.text = props.text;
	}
}

type Printers = Map<
	unknown,
	(node: unknown, availablePrinters: Printers) => string
>;

const printers: Printers = new Map<
	unknown,
	(node: unknown, availablePrinters: Printers) => string
>([
	[Recipe, printRecipe],
	[Ingredients, printIngredients],
	[Ingredient, printIngredient],
	[Measurement, printMeasurement],
	[Preparation, printPreparation],
	[Directions, printDirections],
	[Step, printStep],
]);

function printNode(node: unknown, availablePrinters = printers): string {
	const printer = availablePrinters.get(node.constructor);
	if (printer) {
		return printer(node, availablePrinters);
	}

	return node.toString();
}

export function printRecipe(
	{ name, meal, children }: Recipe,
	availablePrinters = printers,
): string {
	const childrenText = children
		.map((child) => printNode(child, availablePrinters))
		.join("\n");

	return `${name} (${meal.join(", ")})\n${childrenText}`;
}

export function printIngredients(
	{ children }: Ingredients,
	availablePrinters = printers,
): string {
	//TODO: group by category
	const childrenText = children
		.map((child) => printNode(child, availablePrinters))
		.map((child) => `- ${child}`)
		.join("\n");

	return `Ingredients\n${childrenText}`;
}

export function printIngredient({ name, quantity }: Ingredient): string {
	return `${name} ${formatQuantity(quantity)}`;
}

export function printMeasurement({ quantity }: Measurement): string {
	return formatQuantity(quantity);
}

export function printSimpleIngredient({ name }: Ingredient): string {
	return `${name}`;
}

export function printPreparation(
	{ children }: Preparation,
	availablePrinters = printers,
): string {
	const printersOverride = new Map(availablePrinters);
	printersOverride.set(Ingredient, printSimpleIngredient);

	const childrenText = children
		.map((child) => printNode(child, printersOverride))
		.join("\n");

	return `Preparation\n${childrenText}`;
}

export function printDirections(
	{ children }: Directions,
	availablePrinters = printers,
): string {
	const printersOverride = new Map(availablePrinters);
	printersOverride.set(Ingredient, printSimpleIngredient);

	const childrenText = children
		.map((child) => printNode(child, printersOverride))
		.join("\n");

	return `Directions\n${childrenText}`;
}

export function printStep(
	{ children, duration }: Step,
	availablePrinters = printers,
): string {
	const childrenText = children
		.map((child) => printNode(child, availablePrinters))
		.join("");

	return `-${
		duration ? ` (duration ${formatQuantity(duration)})` : ""
	} ${childrenText}`;
}
