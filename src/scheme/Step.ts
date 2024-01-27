import { Quantity, QuantityProp, parseQuantity } from ".";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";

interface Props extends RecipeContainerProps {
	duration?: QuantityProp;
}

export class Step extends RecipeContainer {
	duration?: Quantity;

	constructor(props: Props) {
		super(props);

		this.duration = parseQuantity(props.duration);
	}
}
