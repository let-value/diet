import { Quantity, QuantityProp } from ".";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";
interface StepProps extends RecipeContainerProps {
    duration?: QuantityProp;
}
export declare class Step extends RecipeContainer {
    duration?: Quantity;
    constructor(props: StepProps);
}
export {};
