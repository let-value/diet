import { Meal, recipes } from "../index";

export function buildCookbook() {
	const list = Object.keys(recipes);

	const groups = Object.values(recipes).reduce(
		(groups, recipe) => {
			for (const group of recipe.meal) {
				if (!groups[group]) {
					groups[group] = [];
				}
				groups[group].push(recipe.name);
			}
			return groups;
		},
		{} as Partial<Record<Meal, string[]>>,
	);

	function getRandomRecipe(group: string[] = []) {
		return group[Math.floor(Math.random() * group.length)];
	}

	return {
		list,
		groups,
		getRandomRecipe,
	};
}
