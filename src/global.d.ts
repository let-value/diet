import * as scheme from "./scheme";

declare global {
	const jsx: typeof scheme.jsx;
	const Recipe: typeof scheme.Recipe;
	const Directions: typeof scheme.Directions;
	const Ingredients: typeof scheme.Ingredients;
	const Preparation: typeof scheme.Preparation;
	const Step: typeof scheme.Step;
	const Ingredient: typeof scheme.Ingredient;
	// biome-ignore lint/style/noVar: <explanation>
	var recipes: Record<string, scheme.Recipe>;
}
