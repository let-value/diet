export interface RecipeContainerProps<TChildren = unknown> {
	children?: TChildren | TChildren[];
}

export class RecipeContainer<TChildren = unknown> {
	children: TChildren[];

	constructor(props: RecipeContainerProps<TChildren>) {
		this.children = Array.isArray(props.children)
			? props.children
			: [props.children];
	}
}
