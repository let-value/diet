export interface RecipeContainerProps {
	children?: unknown | unknown[];
}

export class RecipeContainer {
	children: unknown[];

	constructor(props: RecipeContainerProps) {
		this.children = Array.isArray(props.children)
			? props.children
			: [props.children];
	}
}
