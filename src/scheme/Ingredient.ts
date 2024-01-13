import { Options, OptionsProp } from "./Options";
import { Quantity, QuantityProp, parseQuantity } from "./Quantity";
import { joinStringChildren } from "./helpers";

interface Props {
	key?: string;
	name?: string;
	quantity?: QuantityProp;
	category?: OptionsProp<string>;
	manipulation?: OptionsProp<string>;
	children?: string;
}

export class Ingredient {
	key?: string;
	name?: string;
	quantity?: Quantity;
	category?: Options<string>;
	manipulation?: Options<string>;

	constructor(props: Props) {
		this.key = props.key;
		this.name = joinStringChildren(props.children) ?? props.name;
		this.quantity = parseQuantity(props.quantity);
		this.category = new Options(props.category);
		this.manipulation = new Options(props.manipulation);
	}
}
