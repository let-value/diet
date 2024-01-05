/// <reference types="bun-types" />
declare module "recipePlugin" {
    import { BunPlugin } from "bun";
    export const recipePlugin: BunPlugin;
}
declare module "build" { }
declare module "src/cookbook" {
    export const cookbook: string[];
}
declare module "src/scheme/jsx" {
    export function jsx<T, P>(tag: {
        new (props: P): T;
    }, props: P, ...children: unknown[]): T;
}
declare module "src/scheme/Amount" {
    export class Amount {
        count?: number;
        unit?: string;
        constructor(options?: string | Amount);
    }
    export type AmountProp = ConstructorParameters<typeof Amount>[number];
}
declare module "src/scheme/RecipeContainer" {
    export interface RecipeContainerProps {
        children?: unknown[];
    }
    export class RecipeContainer {
        children: unknown[];
        constructor(props: RecipeContainerProps);
    }
}
declare module "src/scheme/Recipe" {
    import { Amount, AmountProp } from "src/scheme/Amount";
    import { RecipeContainer, RecipeContainerProps } from "src/scheme/RecipeContainer";
    interface RecipeProps extends RecipeContainerProps {
        name: string;
        meal: string;
        servings: AmountProp;
    }
    export class Recipe extends RecipeContainer {
        name: string;
        meal: string;
        servings?: Amount;
        constructor(props: RecipeProps);
    }
    export class Directions extends RecipeContainer {
    }
    export class Ingredients extends RecipeContainer {
    }
    export class Preparation extends RecipeContainer {
    }
    export class Step extends RecipeContainer {
    }
}
declare module "src/scheme/Options" {
    export class Options extends Array<string> {
        constructor(options?: string | string[] | Options);
    }
    export type OptionsProp = ConstructorParameters<typeof Options>[number];
}
declare module "src/scheme/Ingredient" {
    import { Amount, AmountProp } from "src/scheme/Amount";
    import { Options, OptionsProp } from "src/scheme/Options";
    interface Props {
        key?: string;
        name?: string;
        amount?: AmountProp;
        category?: OptionsProp;
        manipulation?: OptionsProp;
        children?: string;
    }
    export class Ingredient {
        key?: string;
        name?: string;
        amount?: Amount;
        category?: Options;
        manipulation?: Options;
        constructor(props: Props);
    }
}
declare module "src/scheme/index" {
    export * from "src/scheme/jsx";
    export * from "src/scheme/Recipe";
    export * from "src/scheme/Ingredient";
}
declare module "src/index" {
    import * as scheme from "src/scheme/index";
    const recipes: Record<string, scheme.Recipe>;
    export { recipes };
}
declare module "src/recipes/Chicken Stir-Fry" { }
declare module "src/recipes/Egg and Vegetable Scramble" { }
