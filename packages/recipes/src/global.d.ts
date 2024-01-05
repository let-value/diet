import * as schema from "schema";

declare global {
	const jsx: typeof schema.jsx;
	const Recipe: typeof schema.Recipe;
	const Directions: typeof schema.Directions;
	const Ingredients: typeof schema.Ingredients;
	const Preparation: typeof schema.Preparation;
	const Step: typeof schema.Step;
	const Ingredient: typeof schema.Ingredient;
	// biome-ignore lint/style/noVar: <explanation>
	var recipes: Map<string, schema.Recipe>;
}
