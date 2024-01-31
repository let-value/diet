import { Options, OptionsProp } from "./Options";
import { Quantity, QuantityProp, parseQuantity } from "./Quantity";
import { joinStringChildren } from "./helpers";

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

export class Ingredient {
	key?: string;
	name?: string;
	description?: string;
	quantity?: Quantity;
	category?: Options<string>;
	manipulation?: Options<string>;
	optional?: boolean;

	constructor(props: Props) {
		this.key = props.key;
		this.name = props.name ?? joinStringChildren(props.children);
		this.description = props.description;
		this.quantity = parseQuantity(props.quantity);
		this.category = new Options(props.category);
		this.manipulation = new Options(props.manipulation);
		this.optional = Boolean(props.optional);
	}
}
