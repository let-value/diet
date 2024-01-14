import { Ingredient } from "./Ingredient";
import { Options, OptionsProp } from "./Options";
import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";
import { Quantity, QuantityProp, parseQuantity } from "./Quantity";

type Meal = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";

interface RecipeProps extends RecipeContainerProps {
	name: string;
	meal: OptionsProp<Meal>;
	servings: QuantityProp;
}

export class Recipe extends RecipeContainer {
	name: string;
	meal: Options<Meal>;
	servings?: Quantity;

	constructor(props: RecipeProps) {
		super(props);

		this.name = props.name;
		this.meal = new Options<Meal>(props.meal);
		this.servings = parseQuantity(props.servings);
	}
}

export class Directions extends RecipeContainer {}

export class Ingredients extends RecipeContainer<Ingredient> {}

export class Preparation extends RecipeContainer {}
