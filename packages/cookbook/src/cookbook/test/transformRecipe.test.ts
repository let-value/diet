import { describe, test, expect } from "bun:test";

import { Ingredient, Measurement, unit } from "@/scheme";
import { test_recipe } from "@/test/recipe.test";

import {
	scaleRecipe,
	convertRecipeUnits,
	formatQuantity,
} from "../transformRecipe";
import { filterRecipeContainer } from "../recipeContainerExtensions";

test("scaleRecipe", () => {
	const recipe = scaleRecipe(test_recipe, 5);

	const ingredients = filterRecipeContainer(
		recipe,
		(node): node is Ingredient => node instanceof Ingredient,
	);

	const quantities = ingredients
		.map(({ quantity }) => quantity)
		.filter(Boolean)
		.map((quantity) => quantity.toString())
		.toSorted();

	expect(quantities).toEqual(["10 kg", "100 slices", "5", "5 g", "5 tsp"]);
});

describe("convertRecipeUnits", () => {
	test("convert to si", () => {
		const recipe = convertRecipeUnits(test_recipe, "normal");

		const ingredients = filterRecipeContainer(
			recipe,
			(node): node is Ingredient => node instanceof Ingredient,
		);

		const measurements = filterRecipeContainer(
			recipe,
			(node): node is Measurement => node instanceof Measurement,
		);

		const quantities = [
			...ingredients
				.map(({ quantity }) => quantity)
				.filter(Boolean)
				.map((quantity) => quantity.toString({ precision: 2 }))
				.toSorted(),
			...measurements
				.map(({ quantity }) => quantity)
				.filter(Boolean)
				.map((quantity) => quantity.toString({ precision: 2 }))
				.toSorted(),
		];

		expect(quantities).toEqual([
			"1",
			"1 g",
			"1 tsp",
			"2 kg",
			"20 slices",
			"100 degC",
			"600 s",
			"600 s",
		]);
	});

	test("convert to us", () => {
		const recipe = convertRecipeUnits(test_recipe, "us");

		const ingredients = filterRecipeContainer(
			recipe,
			(node): node is Ingredient => node instanceof Ingredient,
		);

		const measurements = filterRecipeContainer(
			recipe,
			(node): node is Measurement => node instanceof Measurement,
		);

		const quantities = [
			...ingredients
				.map(({ quantity }) => quantity)
				.filter(Boolean)
				.map((quantity) => quantity.toString({ precision: 2 }))
				.toSorted(),
			...measurements
				.map(({ quantity }) => quantity)
				.filter(Boolean)
				.map((quantity) => quantity.toString({ precision: 2 }))
				.toSorted(),
		];

		expect(quantities).toEqual([
			"0.0022 lbm",
			"1",
			"1 tsp",
			"20 slices",
			"4.4 lbm",
			"210 degF",
			"600 s",
			"600 s",
		]);
	});
});

describe("formatQuantity", () => {
	test("gram", () => {
		expect(formatQuantity(unit("1g"))).toEqual("1 g");
		expect(formatQuantity(unit("10g"))).toEqual("10 g");
		expect(formatQuantity(unit("100g"))).toEqual("100 g");
		expect(formatQuantity(unit("1000g"))).toEqual("1 kg");
		expect(formatQuantity(unit("5000g"))).toEqual("5 kg");
		expect(formatQuantity(unit("5500g"))).toEqual("5.5 kg");
		expect(formatQuantity(unit("10000g"))).toEqual("10 kg");
		expect(formatQuantity(unit("100000g"))).toEqual("100 kg");
	});

	test("time", () => {
		expect(formatQuantity(unit("1s"))).toEqual("1 s");
		expect(formatQuantity(unit("10s"))).toEqual("10 s");
		expect(formatQuantity(unit("1min"))).toEqual("1 m");
		expect(formatQuantity(unit("120s"))).toEqual("2 m");
		expect(formatQuantity(unit("140s"))).toEqual("2 m 20 s");
		expect(formatQuantity(unit("10min"))).toEqual("10 m");
		expect(formatQuantity(unit("3600s"))).toEqual("1 h");
		expect(formatQuantity(unit("3720s"))).toEqual("1 h 2 m");
		expect(formatQuantity(unit("1day"))).toEqual("1 d");
		expect(formatQuantity(unit("90000s"))).toEqual("1 d 1 h");
		expect(formatQuantity(unit("90001s"))).toEqual("1 d 1 h 1 s");
	});

	test("temperature", () => {
		expect(formatQuantity(unit("0degC"))).toEqual("0 degC");
		expect(formatQuantity(unit("100degC"))).toEqual("100 degC");
		expect(formatQuantity(unit("0degF"))).toEqual("0 degF");
		expect(formatQuantity(unit("100degF"))).toEqual("100 degF");
	});

	test("spoons", () => {
		expect(formatQuantity(unit("1tsp"))).toEqual("1 tsp");
		expect(formatQuantity(unit("10tsp"))).toEqual("10 tsp");
		expect(formatQuantity(unit("1tbsp"))).toEqual("1 tbsp");
		expect(formatQuantity(unit("10tbsp"))).toEqual("10 tbsp");

		expect(formatQuantity(unit("1tsp").to("ml"))).toEqual("4.9 ml");
		expect(formatQuantity(unit("15tsp").to("tbsp"))).toEqual("5 tbsp");
		expect(formatQuantity(unit("1tbsp").to("ml"))).toEqual("15 ml");
		expect(formatQuantity(unit("15tbsp").to("tsp"))).toEqual("45 tsp");
	});
});
