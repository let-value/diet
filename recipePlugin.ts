import { file, BunPlugin } from "bun";

const regexp = /<Recipe(?:[\s\S]+?)name="(?<name>.+?)"(?:[\s\S]+?)<\/Recipe>/gm;

function splice(src: string, idx: number, rem: number, str: string) {
	return src.slice(0, idx) + str + src.slice(idx + Math.abs(rem));
}

export const recipePlugin: BunPlugin = {
	name: "recipe",
	setup(builder) {
		builder.onLoad({ filter: /src\/recipes/ }, async ({ loader, path }) => {
			const bunFile = file(path);

			let text = await bunFile.text();

			const recepies = text.matchAll(regexp);

			for (const match of Array.from(recepies).reverse()) {
				text = splice(
					text,
					match.index,
					0,
					`recipes["${match.groups.name}"] = `,
				);
			}

			return { loader, contents: text };
		});
	},
};
