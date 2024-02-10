import { test, expect } from "bun:test";

import {
	jsx,
	Recipe,
	Directions,
	Step,
	Ingredients,
	Ingredient,
	Preparation,
	Measurement,
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
				it at <Measurement>100 celsius</Measurement> for{" "}
				<Measurement>10 minutes</Measurement>
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
				and boil it for <Measurement>10 minutes</Measurement>
			</Step>
		</Preparation>
		<Directions>
			<Step>step 1</Step>
			<Step>step 2</Step>
			<Step>step 3</Step>
		</Directions>
	</Recipe>
);

test("test_recipe", () => {
	expect(test_recipe).toMatchSnapshot();
});

export const exotic_recipe = (
	<Recipe name="Exotic Fruit Salad" meal="dessert" servings="6">
		<Ingredients>
			<Ingredient name="dragon fruit" quantity="2" category="fruit" />
			<Ingredient name="mango" quantity="1" category="fruit" />
			<Ingredient name="kiwi" quantity="3" category="fruit" />
			<Ingredient name="pomegranate seeds" quantity="1 cup" category="fruit" />
			<Ingredient name="fresh mint leaves" quantity="15 g" category="herb" />
			<Ingredient name="lime juice" quantity="2 tbsp" category="liquid" />
			<Ingredient
				name="honey"
				quantity="1 tbsp"
				category="sweetener"
				optional
			/>
		</Ingredients>
		<Preparation>
			<Step>
				Peel and cube the <Ingredient>dragon fruit</Ingredient> and{" "}
				<Ingredient>mango</Ingredient>. Slice the{" "}
				<Ingredient name="kiwi">kiwis</Ingredient>.
			</Step>
			<Step>
				In a large bowl, combine the cubed <Ingredient name="dragon fruit" />,{" "}
				<Ingredient name="mango" />, sliced <Ingredient name="kiwi" />, and{" "}
				<Ingredient>pomegranate seeds</Ingredient>.
			</Step>
			<Step>
				Gently toss with <Ingredient>lime juice</Ingredient> and{" "}
				<Ingredient optional>honey</Ingredient> (if using).
			</Step>
			<Step duration="5 minutes">
				Let the salad sit for <Measurement>5 minutes</Measurement> to blend the
				flavors.
			</Step>
			<Step>
				Garnish with{" "}
				<Ingredient name="fresh mint leaves">fresh mint leaves</Ingredient>{" "}
				before serving.
			</Step>
		</Preparation>
		<Directions>
			<Step>Prepare and combine fruits</Step>
			<Step>Toss with dressing</Step>
			<Step>Let sit and blend flavors</Step>
			<Step>Garnish and serve</Step>
		</Directions>
	</Recipe>
);

test("mediterraneanDelight", () => {
	expect(exotic_recipe).toMatchSnapshot();
});
