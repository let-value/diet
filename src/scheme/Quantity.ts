import { createUnit, unit, Unit } from "mathjs";

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

export type Quantity = Unit;
export { unit, Unit };

export function parseQuantity(value?: QuantityProp) {
	try {
		return unit(value as never);
	} catch (error) {
		return undefined;
	}
}

export type QuantityProp =
	| Parameters<typeof unit>[number]
	| Quantity
	| undefined;
