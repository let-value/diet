import { Quantity } from "./Quantity";
interface MeasurementProps {
    scale?: boolean;
    value?: string;
    children?: string;
}
export declare class Measurement {
    scale?: boolean;
    quantity?: Quantity;
    constructor(props: MeasurementProps);
}
export {};
