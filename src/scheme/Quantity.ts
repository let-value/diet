import { unit, Unit } from "mathjs";

import "./customUnits";

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
