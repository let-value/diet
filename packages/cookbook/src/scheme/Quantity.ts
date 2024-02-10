import { unit, Unit } from "./customUnits";

export type Quantity = Unit;

export type QuantityProp =
	| Parameters<typeof unit>[number]
	| Quantity
	| undefined;

export function parseQuantity(value?: QuantityProp): Unit | undefined {
	if (value === undefined) return undefined;

	try {
		const result = unit(value?.toString());
		assertValidQuantity(result);
		return result;
	} catch (error) {
		if (error instanceof QuantityAssertionError) {
			console.error(error);
		}

		return undefined;
	}
}

export class QuantityAssertionError extends Error {}

export function assertValidQuantity(quantity: Unit, message = "") {
	const value = quantity.getNormalizedValue();
	const isnan = Number.isNaN(value);
	const notNumber = typeof value !== "number";

	if (isnan || notNumber) {
		throw new QuantityAssertionError(
			`not valid quantity "${quantity.toString()}", isNaN: ${isnan}, notNumber: ${notNumber}, message: ${message}`,
		);
	}
}
