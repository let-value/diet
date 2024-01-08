import { Amount, AmountProp } from "./Amount";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";

interface Props extends RecipeContainerProps {
	duration?: AmountProp;
}

export class Step extends RecipeContainer {
	duration?: Amount;

	constructor(props: Props) {
		super(props);

		this.duration = new Amount(props.duration);
	}
}
