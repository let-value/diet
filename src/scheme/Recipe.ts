import { Amount, AmountProp, parseAmount } from "./Amount";
import { Options, OptionsProp } from "./Options";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";

type Meal = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";

interface RecipeProps extends RecipeContainerProps {
	name: string;
	meal: OptionsProp<Meal>;
	servings: AmountProp;
}

export class Recipe extends RecipeContainer {
	name: string;
	meal: Options<Meal>;
	servings?: Amount;

	constructor(props: RecipeProps) {
		super(props);

		this.name = props.name;
		this.meal = new Options<Meal>(props.meal);
		this.servings = parseAmount(props.servings);
	}
}

export class Directions extends RecipeContainer {}

export class Ingredients extends RecipeContainer {}

export class Preparation extends RecipeContainer {}
