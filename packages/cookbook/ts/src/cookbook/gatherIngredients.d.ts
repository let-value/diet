import { Ingredient, Ingredients, RecipeContainer } from "@/scheme";
export declare function getIngredientKey({ key, name }: Ingredient): string;
/**
 * @inheritdoc assertIngredientPart
 */
export declare function gatherIngredients(recipe: RecipeContainer): Ingredients;
