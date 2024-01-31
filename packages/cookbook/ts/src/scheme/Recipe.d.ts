import { Options, OptionsProp } from "./Options";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";
import { Quantity, QuantityProp } from "./Quantity";
export type Meal = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
interface RecipeProps extends RecipeContainerProps {
    name: string;
    description?: string;
    meal: OptionsProp<Meal>;
    servings: QuantityProp;
}
export declare class Recipe extends RecipeContainer {
    name: string;
    description?: string;
    meal: Options<Meal>;
    servings?: Quantity;
    constructor(props: RecipeProps);
}
export {};
