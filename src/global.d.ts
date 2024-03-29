import * as scheme from "./scheme";

declare global {
	const jsx: typeof scheme.jsx;
	const Recipe: typeof scheme.Recipe;
	const RecipeContainer: typeof scheme.RecipeContainer;
	const Directions: typeof scheme.Directions;
	const Ingredients: typeof scheme.Ingredients;
	const Preparation: typeof scheme.Preparation;
	const Step: typeof scheme.Step;
	const Ingredient: typeof scheme.Ingredient;
	const Measurement: typeof scheme.Measurement;
	function buildCookbook(): void;
}
