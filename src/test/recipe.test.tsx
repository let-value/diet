import { test, expect } from "bun:test";

import {
	jsx,
	Recipe,
	Directions,
	Step,
	Ingredients,
	Ingredient,
	Preparation,
} from "@/scheme";

export const test_recipe = (
	<Recipe name="test recipe" meal="breakfast,lunch,dinner" servings="4">
		<Directions>
			<Step>step 1</Step>
			<Step>step 2</Step>
			<Step>step 3</Step>
		</Directions>
		<Ingredients>
			<Ingredient name="ingredient1" quantity="1g" category="category1" />
			<Ingredient category="category2">ingredient2 (raw)</Ingredient>
			<Ingredient key="ingredient3" quantity="20 slices" category="category3">
				Fresh ingredient 3
			</Ingredient>
		</Ingredients>
		<Preparation>
			<Step>
				take <Ingredient manipulation="boil">ingredient1</Ingredient> and boil
				it
			</Step>
			<Step>
				then take{" "}
				<Ingredient quantity="2kg" manipulation="fry">
					ingredient2
				</Ingredient>{" "}
				and fry in on a pan
			</Step>
			<Step duration={10}>
				after that take{" "}
				<Ingredient key="ingredient3" manipulation="boil">
					ingredient 3
				</Ingredient>{" "}
				and boil it for 10 minutes
			</Step>
		</Preparation>
	</Recipe>
);

test("jsx recipe", () => {
	expect(test_recipe).toMatchSnapshot();
});
