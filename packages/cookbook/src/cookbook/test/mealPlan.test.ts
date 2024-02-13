import { test, expect } from "bun:test";

import { test_recipe, exotic_recipe } from "@/test/recipe.test";

import { createPlan } from "../normalizeRecipe";
import { scaleRecipe } from "../transformRecipe";
import { formatQuantity } from "../formatQuantity";
import { gatherIngredients } from "../gatherIngredients";

test("meal plan", () => {
	const days = 2;

	const plan = createPlan([test_recipe, exotic_recipe]);

	const { children: ingredients } = gatherIngredients(plan);

	expect(
		ingredients.map(
			({ name, quantity }) => `${name} ${formatQuantity(quantity)}`,
		),
	).toEqual([
		"ingredient1 1 g",
		"ingredient2 (raw) 2 kg",
		"Fresh ingredient 3 20 slices",
		"ingredient4 1 tsp",
		"ingredient5 1",
		"dragon fruit 2",
		"mango 1",
		"kiwi 3",
		"pomegranate seeds 1 cup",
		"fresh mint leaves 15 g",
		"lime juice 2 tbsp",
		"honey 1 tbsp",
	]);

	const scaledPlan = scaleRecipe(plan, days);

	const { children: groceries } = gatherIngredients(scaledPlan);

	expect(
		groceries.map(
			({ name, quantity }) => `${name} ${formatQuantity(quantity)}`,
		),
	).toEqual([
		"ingredient1 2 g",
		"ingredient2 (raw) 4 kg",
		"Fresh ingredient 3 40 slices",
		"ingredient4 2 tsp",
		"ingredient5 2",
		"dragon fruit 4",
		"mango 2",
		"kiwi 6",
		"pomegranate seeds 2 cup",
		"fresh mint leaves 30 g",
		"lime juice 4 tbsp",
		"honey 2 tbsp",
	]);
});
