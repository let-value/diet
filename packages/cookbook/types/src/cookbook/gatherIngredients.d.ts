import { Recipe, Ingredient, Ingredients } from "@/scheme";
export declare function getIngredientKey({ key, name }: Ingredient): string;
export declare function gatherIngredients(recipe: Recipe): Ingredients;
