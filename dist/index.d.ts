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
        quantity?: number;
        unit?: string;
        constructor(props: Amount);
    }
    export function parseAmount(options?: string | number | Amount): Amount;
    export type AmountProp = Parameters<typeof parseAmount>[number];
}
declare module "src/scheme/Options" {
    type CommaSeparated<T extends string, U extends T = T> = T extends string ? [U] extends [T] ? T : `${`${T},` | ""}${CommaSeparated<Exclude<U, T>>}` : T;
    function parseOptions<TOptions extends string>(options: TOptions | TOptions[] | CommaSeparated<TOptions> | Options<TOptions>): TOptions[];
    export class Options<TOptions extends string> extends Array<TOptions> {
        constructor(...args: Parameters<typeof parseOptions<TOptions>>);
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
declare module "src/scheme/Quantity" {
    import Quantity from "js-quantities";
    export { Quantity };
    export function parseQuantity(value?: QuantityProp): Quantity;
    export type QuantityProp = ConstructorParameters<typeof Quantity>[number] | Quantity | undefined;
}
declare module "src/scheme/helpers" {
    export function joinStringChildren(children?: string | string[]): string;
}
declare module "src/scheme/Ingredient" {
    import { Options, OptionsProp } from "src/scheme/Options";
    import { Quantity, QuantityProp } from "src/scheme/Quantity";
    interface Props {
        key?: string;
        name?: string;
        quantity?: QuantityProp;
        category?: OptionsProp<string>;
        manipulation?: OptionsProp<string>;
        children?: string;
    }
    export class Ingredient {
        key?: string;
        name?: string;
        quantity?: Quantity;
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
    export * from "src/scheme/Amount";
    export * from "src/scheme/Quantity";
}
declare module "src/recipes" {
    import { Recipe } from "src/scheme/index";
    export const recipes: Record<string, Recipe>;
}
declare module "src/cookbook/cookbook" {
    export let cookbook: any;
    export function buildCookbook(): any;
}
declare module "src/cookbook/index" {
    export * from "src/cookbook/cookbook";
}
declare module "src/index" {
    export * from "src/scheme/index";
    export * from "src/recipes";
    export * from "src/cookbook/index";
}
declare module "src/cookbook/flattenRecipeContainer" {
    import { RecipeContainer } from "src/scheme/index";
    export function flattenRecipeContainer(container: RecipeContainer): Generator<unknown>;
}
declare module "src/cookbook/normalizeRecipe" {
    import { Recipe, Ingredient } from "src/scheme/index";
    export function getIngredientKey({ key, name }: Ingredient): string;
    export function gatherIngredients(recipe: Recipe): Ingredient[];
    export function normalizeRecipe(recipe: Recipe): {
        recipe: Recipe;
        ingredients: Ingredient[];
    };
}
declare module "src/test/recipe.test" {
    export const test_recipe: any;
}
declare module "src/cookbook/test/flattenRecipeContainer.test" { }
declare module "src/cookbook/test/normalizeRecipe.test" { }
declare module "src/recipes/Chicken Stir-Fry" { }
declare module "src/recipes/Egg and Vegetable Scramble" { }
