import { test, expect } from "bun:test";

import { test_recipe } from "@/test/recipe.test";
import { flattenRecipeContainer } from "../flattenRecipeContainer";

test("flattenRecipeContainer", () => {
	const array = Array.from(flattenRecipeContainer(test_recipe));

	const groups = Object.groupBy(array, (node) => {
		if (typeof node === "object") {
			return node.constructor.name;
		}

		return typeof node;
	});

	expect(Object.keys(groups)).toHaveLength(7);
});
