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
		<Ingredients>
			<Ingredient name="ingredient1" quantity="1g" category="category1" />
			<Ingredient category="category2">ingredient2 (raw)</Ingredient>
			<Ingredient key="ingredient3" quantity="20 slices" category="category3">
				Fresh ingredient 3
			</Ingredient>
			<Ingredient name="ingredient4" quantity="1tsp" category="category4" />
			<Ingredient category="category5" quantity="1">
				ingredient5
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
			<Step duration="10 minutes">
				after that take{" "}
				<Ingredient key="ingredient3" manipulation="boil">
					ingredient 3
				</Ingredient>{" "}
				and boil it for 10 minutes
			</Step>
		</Preparation>
		<Directions>
			<Step>step 1</Step>
			<Step>step 2</Step>
			<Step>step 3</Step>
		</Directions>
	</Recipe>
);

test("jsx recipe", () => {
	expect(test_recipe).toMatchSnapshot();
});
