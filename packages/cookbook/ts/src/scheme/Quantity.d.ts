import { unit, Unit } from "./customUnits";
export type Quantity = Unit;
export type QuantityProp = Parameters<typeof unit>[number] | Quantity | undefined;
export declare function parseQuantity(value?: QuantityProp): Unit | undefined;