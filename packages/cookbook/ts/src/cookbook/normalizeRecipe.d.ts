import { Recipe, Plan } from "@/scheme";
export declare function normalizeRecipe(original: Recipe): Recipe;
export declare function createPlan(recipes: (Recipe | undefined | null)[]): Plan;
