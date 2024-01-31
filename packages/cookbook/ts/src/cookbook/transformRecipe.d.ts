import { Recipe } from "@/scheme";
export declare function scaleRecipe(original: Recipe, days: number): Recipe;
export declare function convertRecipeUnits(original: Recipe, system: "si" | "us"): Recipe;
