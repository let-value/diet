import { Meal } from "../index";
export declare function buildCookbook(): {
    list: string[];
    groups: Partial<Record<Meal, string[]>>;
    getRandomRecipe: (group?: string[]) => string;
};
