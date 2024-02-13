import { describe, test, expect } from "bun:test";

import { test_recipe } from "@/test/recipe.test";
import { printRecipe } from "../printRecipe";

describe("printRecipe", () => {
	test("test recipe", () => {
		const text = printRecipe(test_recipe);
		expect(text).toEqual(`test recipe (breakfast, lunch, dinner)
Ingredients
- ingredient1 1 g
- ingredient2 (raw) undefined
- Fresh ingredient 3 20 slices
- ingredient4 1 tsp
- ingredient5 1
Preparation
- take ingredient1 and boil it at 100 celsius for 10 m
- then take ingredient2 and fry in on a pan
- (duration 10 m) after that take ingredient 3 and boil it for 10 m
Directions
- step 1
- step 2
- step 3`);
	});
});
