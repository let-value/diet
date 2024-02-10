import { Quantity, Unit, RecipeContainer } from "@/scheme";
export declare function scaleRecipe<TContainer extends RecipeContainer>(original: TContainer, days: number): TContainer;
export declare function convertRecipeUnits<TContainer extends RecipeContainer>(original: TContainer, system: "normal" | "us"): TContainer;
export declare function formatQuantity(quantity: Quantity, { simplify, format, }?: {
    simplify?: Parameters<Unit["simplify"]>[0];
    format?: Parameters<Unit["toString"]>[0];
}): string;
