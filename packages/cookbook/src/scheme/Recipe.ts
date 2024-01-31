import { Options, OptionsProp } from "./Options";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";
import { Quantity, QuantityProp, parseQuantity } from "./Quantity";

export type Meal = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";

interface RecipeProps extends RecipeContainerProps {
	name: string;
	description?: string;
	meal: OptionsProp<Meal>;
	servings: QuantityProp;
}

export class Recipe extends RecipeContainer {
	name: string;
	description?: string;
	meal: Options<Meal>;
	servings?: Quantity;

	constructor(props: RecipeProps) {
		super(props);

		this.name = props.name;
		this.description = props.description;
		this.meal = new Options<Meal>(props.meal);
		this.servings = parseQuantity(props.servings);
	}
}
