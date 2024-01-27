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
declare module "src/scheme/Options" {
    type CommaSeparated<T extends string, U extends T = T> = T extends string ? [U] extends [T] ? T : `${`${T},` | ""}${CommaSeparated<Exclude<U, T>>}` : T;
    function parseOptions<TOptions extends string>(options: TOptions | TOptions[] | CommaSeparated<TOptions> | Options<TOptions>): TOptions[];
    export class Options<TOptions extends string> extends Array<TOptions> {
        constructor(...args: Parameters<typeof parseOptions<TOptions>>);
    }
    export type OptionsProp<TOptions extends string> = ConstructorParameters<typeof Options<TOptions>>[number];
}
declare module "src/scheme/RecipeContainer" {
    export interface RecipeContainerProps<TChildren = unknown> {
        children?: TChildren | TChildren[];
    }
    export class RecipeContainer<TChildren = unknown> {
        children: TChildren[];
        constructor(props: RecipeContainerProps<TChildren>);
    }
}
declare module "src/scheme/customUnits" { }
declare module "src/scheme/Quantity" {
    import { unit, Unit } from "mathjs";
    import "src/scheme/customUnits";
    export type Quantity = Unit;
    export type QuantityProp = Parameters<typeof unit>[number] | Quantity | undefined;
    export function parseQuantity(value?: QuantityProp): Unit;
}
declare module "src/scheme/Recipe" {
    import { Options, OptionsProp } from "src/scheme/Options";
    import { RecipeContainer, RecipeContainerProps } from "src/scheme/RecipeContainer";
    import { Quantity, QuantityProp } from "src/scheme/Quantity";
    type Meal = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
    interface RecipeProps extends RecipeContainerProps {
        name: string;
        description?: string;
        meal: OptionsProp<Meal>;
        servings: QuantityProp;
    }
    export class Recipe extends RecipeContainer {
        name: string;
        description?: string;
        meal: Options<Meal>;
        servings?: Quantity;
        constructor(props: RecipeProps);
    }
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
        description?: string;
        quantity?: QuantityProp;
        category?: OptionsProp<string>;
        manipulation?: OptionsProp<string>;
        children?: string;
    }
    export class Ingredient {
        key?: string;
        name?: string;
        description?: string;
        quantity?: Quantity;
        category?: Options<string>;
        manipulation?: Options<string>;
        constructor(props: Props);
    }
}
declare module "src/scheme/Ingredients" {
    import { Ingredient } from "src/scheme/Ingredient";
    import { RecipeContainer } from "src/scheme/RecipeContainer";
    export class Ingredients extends RecipeContainer<Ingredient> {
    }
}
declare module "src/scheme/Step" {
    import { Quantity, QuantityProp } from "src/scheme/index";
    import { RecipeContainer, RecipeContainerProps } from "src/scheme/RecipeContainer";
    interface Props extends RecipeContainerProps {
        duration?: QuantityProp;
    }
    export class Step extends RecipeContainer {
        duration?: Quantity;
        constructor(props: Props);
    }
}
declare module "src/scheme/Preparation" {
    import { RecipeContainer } from "src/scheme/RecipeContainer";
    export class Preparation extends RecipeContainer {
    }
}
declare module "src/scheme/Directions" {
    import { RecipeContainer } from "src/scheme/RecipeContainer";
    export class Directions extends RecipeContainer {
    }
}
declare module "src/scheme/Measurement" {
    import { Quantity } from "src/scheme/Quantity";
    interface Props {
        scale?: boolean;
        value?: string;
        children?: string;
    }
    export class Measurement {
        scale?: boolean;
        quantity?: Quantity;
        constructor(props: Props);
    }
}
declare module "src/scheme/index" {
    export * from "src/scheme/jsx";
    export * from "src/scheme/Recipe";
    export * from "src/scheme/RecipeContainer";
    export * from "src/scheme/Ingredient";
    export * from "src/scheme/Ingredients";
    export * from "src/scheme/Step";
    export * from "src/scheme/Quantity";
    export * from "src/scheme/Options";
    export * from "src/scheme/Preparation";
    export * from "src/scheme/Directions";
    export * from "src/scheme/Measurement";
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
declare module "src/cookbook/recipeContainerExtensions" {
    import { RecipeContainer } from "src/scheme/index";
    export function flattenRecipeContainer(container: RecipeContainer): unknown[];
    export function findRecipeContainer<S = unknown>(container: RecipeContainer, predicate: (node: unknown) => node is S): S | undefined;
    export function filterRecipeContainer<S = unknown>(container: RecipeContainer, predicate: (node: unknown) => node is S): S[];
    export function mapRecipeContainer<T extends RecipeContainer>(container: T, map: (node: unknown) => unknown): unknown;
}
declare module "src/cookbook/gatherIngredients" {
    import { Recipe, Ingredient, Ingredients } from "src/scheme/index";
    export function getIngredientKey({ key, name }: Ingredient): string;
    export function gatherIngredients(recipe: Recipe): Ingredients;
}
declare module "src/cookbook/normalizeRecipe" {
    import { Recipe } from "src/scheme/index";
    export function normalizeRecipe(original: Recipe): Recipe;
}
declare module "src/test/recipe.test" {
    export const test_recipe: any;
}
declare module "src/cookbook/test/gatherIngredients.test" { }
declare module "src/cookbook/test/normalizeRecipe.test" { }
declare module "src/cookbook/test/recipeContainerExtensions.test" { }
declare module "src/recipes/Chicken Stir-Fry" { }
declare module "src/recipes/Egg and Vegetable Scramble" { }
declare module "src/recipes/Ranch Chicken Meal Prep" { }
