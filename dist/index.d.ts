/// <reference types="bun-types" />
declare module "recipePlugin" {
    import { BunPlugin } from "bun";
    export const recipePlugin: BunPlugin;
}
declare module "build" {
    export const DIST_PATH = "dist";
    export function buildCookbook(): Promise<boolean>;
}
declare module "serve" {
    export function startServer(): import("bun").Server;
}
declare module "watch" { }
declare module "src/scheme/jsx" {
    export function jsx<T, P>(tag: {
        new (props: P): T;
    }, props: P, ...children: unknown[]): T;
}
declare module "src/scheme/Amount" {
    export class Amount {
        count?: number;
        unit?: string;
        constructor(options?: string | number | Amount);
    }
    export type AmountProp = ConstructorParameters<typeof Amount>[number];
}
declare module "src/scheme/Options" {
    type CommaSeparated<T extends string, U extends T = T> = T extends string ? [U] extends [T] ? T : `${`${T},` | ""}${CommaSeparated<Exclude<U, T>>}` : T;
    export class Options<TOptions extends string> extends Array<TOptions> {
        constructor(options: TOptions | TOptions[] | CommaSeparated<TOptions> | Options<TOptions>);
    }
    export type OptionsProp<TOptions extends string> = ConstructorParameters<typeof Options<TOptions>>[number];
}
declare module "src/scheme/RecipeContainer" {
    export interface RecipeContainerProps {
        children?: unknown | unknown[];
    }
    export class RecipeContainer {
        children: unknown[];
        constructor(props: RecipeContainerProps);
    }
}
declare module "src/scheme/Recipe" {
    import { Amount, AmountProp } from "src/scheme/Amount";
    import { Options, OptionsProp } from "src/scheme/Options";
    import { RecipeContainer, RecipeContainerProps } from "src/scheme/RecipeContainer";
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
        constructor(props: RecipeProps);
    }
    export class Directions extends RecipeContainer {
    }
    export class Ingredients extends RecipeContainer {
    }
    export class Preparation extends RecipeContainer {
    }
}
declare module "src/scheme/Ingredient" {
    import { Amount, AmountProp } from "src/scheme/Amount";
    import { Options, OptionsProp } from "src/scheme/Options";
    interface Props {
        key?: string;
        name?: string;
        amount?: AmountProp;
        category?: OptionsProp<string>;
        manipulation?: OptionsProp<string>;
        children?: string;
    }
    export class Ingredient {
        key?: string;
        name?: string;
        amount?: Amount;
        category?: Options<string>;
        manipulation?: Options<string>;
        constructor(props: Props);
    }
}
declare module "src/scheme/Step" {
    import { Amount, AmountProp } from "src/scheme/Amount";
    import { RecipeContainer, RecipeContainerProps } from "src/scheme/RecipeContainer";
    interface Props extends RecipeContainerProps {
        duration?: AmountProp;
    }
    export class Step extends RecipeContainer {
        duration?: Amount;
        constructor(props: Props);
    }
}
declare module "src/scheme/index" {
    export * from "src/scheme/jsx";
    export * from "src/scheme/Recipe";
    export * from "src/scheme/RecipeContainer";
    export * from "src/scheme/Ingredient";
    export * from "src/scheme/Step";
}
declare module "src/recipes" {
    import { Recipe } from "src/scheme/index";
    export const recipes: Record<string, Recipe>;
}
declare module "src/cookbook/cookbook" {
    export let cookbook: any;
    export function buildCookbook(): any;
}
declare module "src/cookbook/recipeExtensions" {
    import { Recipe, RecipeContainer } from "src/scheme/index";
    export function flattenRecipeContainer(container: RecipeContainer): Generator<unknown>;
    export function normalizeRecipe(recipe: Recipe): {
        ingredients: unknown[];
        name: string;
        meal: import("@/scheme/Options").Options<"breakfast" | "lunch" | "dinner" | "snack" | "dessert">;
        servings?: import("@/scheme/Amount").Amount;
        children: unknown[];
    };
}
declare module "src/cookbook/index" {
    export * from "src/cookbook/cookbook";
    export * from "src/cookbook/recipeExtensions";
}
declare module "src/index" {
    export * from "src/scheme/index";
    export * from "src/recipes";
    export * from "src/cookbook/index";
}
declare module "src/recipe.test" {
    export const test_Recipe: any;
}
declare module "src/recipes/Chicken Stir-Fry" { }
declare module "src/recipes/Egg and Vegetable Scramble" { }
