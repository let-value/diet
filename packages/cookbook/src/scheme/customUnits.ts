import { createUnit } from "mathjs";
import unitmath from "unitmath";

const tsp = {
	name: "tsp",
	definition: "1 teaspoon",
	aliases: ["tsp", "ts", "t"],
};

const tbsp = {
	name: "tbsp",
	definition: "1 tablespoon",
	aliases: ["tbsp", "tbs", "tb"],
};

const things = {
	name: "things",
	aliases: [
		"slice",
		"slices",
		"serving",
		"servings",
		"thing",
		// "things",
		"item",
		"items",
		"piece",
		"pieces",
		"portion",
		"portions",
		"part",
		"parts",
		"unit",
		"units",
		"chunk",
		"chunks",
		"hunk",
		"hunks",
		"slab",
		"slabs",
		"sliver",
		"slivers",
		"wedge",
		"wedges",
		"container",
		"containers",
		"package",
		"packages",
		"dash",
		"dashes",
		"stalk",
		"stalks",
	],
};

const bit = {
	name: "bit",
	definition: "1 thing",
	aliases: ["bit", "bits"],
};

createUnit(
	tsp.name,
	{
		definition: tsp.definition,
		aliases: tsp.aliases,
	},
	{ override: true },
);
createUnit(
	tbsp.name,
	{
		definition: tbsp.definition,
		aliases: tbsp.aliases,
	},
	{ override: true },
);
createUnit(things.name, {
	aliases: things.aliases,
});
createUnit(
	bit.name,
	{
		definition: bit.definition,
		aliases: bit.aliases,
	},
	{ override: true },
);

export const unit = unitmath.config({
	definitions: {
		units: {
			[tsp.name]: {
				value: tsp.definition,
				aliases: tsp.aliases,
			},
			[tbsp.name]: {
				value: tbsp.definition,
				aliases: tbsp.aliases,
			},
			[things.name]: {
				value: "1",
				aliases: things.aliases,
			},
			[bit.name]: {
				value: bit.definition,
				aliases: bit.aliases,
			},
		},
	},
});
