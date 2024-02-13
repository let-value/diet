import { Quantity, Unit } from "@/scheme";
export declare function formatQuantity(quantity: Quantity, { simplify, format, }?: {
    simplify?: Parameters<Unit["simplify"]>[0];
    format?: Parameters<Unit["toString"]>[0];
}): string;
