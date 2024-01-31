import { unit, Unit } from "./customUnits";

export type Quantity = Unit;

export type QuantityProp =
	| Parameters<typeof unit>[number]
	| Quantity
	| undefined;

export function parseQuantity(value?: QuantityProp): Unit | undefined {
	if (value === undefined) return undefined;

	try {
		return unit(value as never);
	} catch (error) {
		return undefined;
	}
}
