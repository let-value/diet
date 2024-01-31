import { Quantity, QuantityProp, parseQuantity } from ".";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";

interface StepProps extends RecipeContainerProps {
	duration?: QuantityProp;
}

export class Step extends RecipeContainer {
	duration?: Quantity;

	constructor(props: StepProps) {
		super(props);

		this.duration = parseQuantity(props.duration);
	}
}
