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

export type UnitFactory = ReturnType<typeof unitmath.config<number>>;
export type Unit = ReturnType<UnitFactory>;

export const unit: UnitFactory = unitmath.config({
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
