import { Unit } from "unitmath";

import { unit } from "./customUnits";

export type Quantity = Unit;

export type QuantityProp =
	| Parameters<typeof unit>[number]
	| Quantity
	| undefined;

export function parseQuantity(value?: QuantityProp) {
	if (value === undefined) return undefined;

	try {
		return unit(value as never);
	} catch (error) {
		return undefined;
	}
}
