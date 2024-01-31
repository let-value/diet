import type { Component } from "solid-js";

import { recipes, buildCookbook, normalizeRecipe, scaleRecipe } from "cookbook";

const { groups, getRandomRecipe } = buildCookbook();
console.log({ recipes, groups });

const breakfast = getRandomRecipe(groups.breakfast ?? []);
const lunch = getRandomRecipe(groups.lunch ?? []);
const dinner = getRandomRecipe(groups.dinner ?? []);
const snack = getRandomRecipe(groups.snack ?? []);

const days = 5;

const plan = [breakfast, lunch, dinner, snack]
	.map((name) => recipes[name])
	.filter(Boolean)
	.map(normalizeRecipe)
	.map((recipe) => scaleRecipe(recipe, days));

console.log({ plan });

export const App: Component = () => {
	return <div>App</div>;
};
