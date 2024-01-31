import { Options, OptionsProp } from "./Options";
import { Quantity, QuantityProp } from "./Quantity";
interface Props {
    key?: string;
    name?: string;
    description?: string;
    quantity?: QuantityProp;
    category?: OptionsProp<string>;
    manipulation?: OptionsProp<string>;
    optional?: boolean;
    children?: string;
}
export declare class Ingredient {
    key?: string;
    name?: string;
    description?: string;
    quantity?: Quantity;
    category?: Options<string>;
    manipulation?: Options<string>;
    optional?: boolean;
    constructor(props: Props);
}
export {};
