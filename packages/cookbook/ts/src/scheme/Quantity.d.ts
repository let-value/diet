import { unit, Unit } from "./customUnits";
export type Quantity = Unit;
export type QuantityProp = Parameters<typeof unit>[number] | Quantity | undefined;
export declare function parseQuantity(value?: QuantityProp): Unit | undefined;
export declare class QuantityAssertionError extends Error {
}
export declare function assertValidQuantity(quantity: Unit, message?: string): void;
