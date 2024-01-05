export interface RecipeContainerProps {
	children?: unknown[];
}

export class RecipeContainer {
	children: unknown[];

	constructor(props: RecipeContainerProps) {
		this.children = props.children;
	}
}
