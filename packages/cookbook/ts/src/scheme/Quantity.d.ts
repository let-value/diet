import { Unit } from "./customUnits";
export type Quantity = Unit;
export type QuantityProp = string | [value: string | number, unit: string] | Quantity | undefined;
export declare function parseFraction(prop: string): [number, string];
export declare function parseQuantity(prop: QuantityProp): Unit | undefined;
export declare class QuantityAssertionError extends Error {
}
export declare function assertValidQuantity(quantity: Unit, message?: string): void;
