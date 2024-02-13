import { RecipeContainer } from "@/scheme";
export declare function scaleRecipe<TContainer extends RecipeContainer>(original: TContainer, days: number): TContainer;
export declare function convertRecipeUnits<TContainer extends RecipeContainer>(original: TContainer, system: "normal" | "us"): TContainer;
