import { RecipeContainer, RecipeContainerProps } from "./RecipeContainer";

interface RecipeProps extends RecipeContainerProps {
	name: string;
	meal: string;
}

export class Recipe extends RecipeContainer {
	name: string;
	meal: string;

	constructor(props: RecipeProps) {
		super(props);

		this.name = props.name;
		this.meal = props.meal;
	}
}

export class Directions extends RecipeContainer {}

export class Ingredients extends RecipeContainer {}

export class Preparation extends RecipeContainer {}

export class Step extends RecipeContainer {}
