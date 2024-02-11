import Fraction from "fraction.js";
import { unit, Unit } from "./customUnits";

export type Quantity = Unit;

export type QuantityProp =
	| string
	| [value: string | number, unit: string]
	| Quantity
	| undefined;

export function parseFraction(prop: string): [number, string] {
	const variants = Array.from({ length: prop.length }, (_, i) => {
		const value = prop.slice(0, i + 1);
		const rest = prop.slice(i + 1);
		let fraction: Fraction | null = null;
		try {
			fraction = new Fraction(value);
		} catch {}
		return { fraction, rest };
	});

	const { fraction, rest } = variants.findLast(({ fraction }) => fraction) ?? {
		fraction: new Fraction(0),
		rest: "",
	};

	const value = (fraction.n / fraction.d) * fraction.s;

	return [value, rest];
}

export function parseQuantity(prop: QuantityProp): Unit | undefined {
	if (prop === undefined) return undefined;
	if (typeof prop === "object" && "clone" in prop) return prop.clone();

	const [value, unitStr] = parseFraction(
		Array.isArray(prop) ? prop.join(" ") : prop,
	);

	try {
		const result = unit(value, unitStr);
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
	const value = quantity.getValue();
	const isnan = Number.isNaN(value);
	const notNumber = typeof value !== "number";

	if (isnan || notNumber) {
		throw new QuantityAssertionError(
			`not valid quantity "${quantity.toString()}", isNaN: ${isnan}, notNumber: ${notNumber}, message: ${message}`,
		);
	}
}
