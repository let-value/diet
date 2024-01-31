import { recipes } from "../index";

export let cookbook = null;

export function buildCookbook() {
	const list = Object.keys(recipes);

	const groups = Object.values(recipes).reduce((groups, recipe) => {
		for (const group of recipe.meal) {
			if (!groups[group]) {
				groups[group] = [];
			}
			groups[group].push(recipe.name);
		}
		return groups;
	}, {});

	function getRandomRecipe(group: string[] = []) {
		return group[Math.floor(Math.random() * group.length)];
	}

	cookbook = {
		list,
		groups,
		getRandomRecipe,
	};

	return cookbook;
}
