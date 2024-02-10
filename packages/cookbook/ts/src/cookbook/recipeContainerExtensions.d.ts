import { RecipeContainer } from "@/scheme";
export declare function flattenRecipeContainer(container: RecipeContainer): unknown[];
export declare function findRecipeContainer<S = unknown>(container: RecipeContainer, predicate: (node: unknown) => node is S): S | undefined;
export declare function filterRecipeContainer<S = unknown>(container: RecipeContainer, predicate: (node: unknown) => node is S): S[];
export declare function mapRecipeContainer<TContainer extends RecipeContainer>(container: TContainer, map: (node: unknown) => unknown): unknown;
