import { Recipe } from "./Recipe";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";

export type PlanProps = RecipeContainerProps<Recipe>;

export class Plan extends RecipeContainer<Recipe> {}
