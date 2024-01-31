import { createUnit } from "mathjs";

createUnit(
	"tsp",
	{
		definition: "1 teaspoon",
		aliases: ["tsp", "ts", "t"],
	},
	{ override: true },
);
createUnit(
	"tbsp",
	{
		definition: "1 tablespoon",
		aliases: ["tbsp", "tbs", "tb"],
	},
	{ override: true },
);

createUnit("things", {
	aliases: [
		"slice",
		"slices",
		"serving",
		"servings",
		"thing",
		"things",
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
});

createUnit(
	"bit",
	{
		definition: "1 thing",
		aliases: ["bit", "bits"],
	},
	{ override: true },
);
