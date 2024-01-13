import { test, expect } from "bun:test";

import { test_recipe } from "@/test/recipe.test";
import { getIngredientKey, gatherIngredients } from "../gatherIngredients";

test("getIngredientKey", () => {
	expect(getIngredientKey({ name: "name" })).toBe("name");
	expect(getIngredientKey({ key: "key", name: "name" })).toBe("key");
	expect(getIngredientKey({ name: "name (description)" })).toBe("name");
});

test("gatherIngredients", () => {
	const ingredients = gatherIngredients(test_recipe);

	expect(ingredients).toHaveLength(3);
});
