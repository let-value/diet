import { Recipe } from "./Recipe";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";
export type PlanProps = RecipeContainerProps<Recipe>;
export declare class Plan extends RecipeContainer<Recipe> {
}
