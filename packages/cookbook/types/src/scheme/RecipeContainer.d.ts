export interface RecipeContainerProps<TChildren = unknown> {
    children?: TChildren | TChildren[];
}
export declare class RecipeContainer<TChildren = unknown> {
    children: TChildren[];
    constructor(props: RecipeContainerProps<TChildren>);
}
