import { Amount, AmountProp } from "./Amount";
import { Options, OptionsProp } from "./Options";

interface Props {
	key?: string;
	name?: string;
	amount?: AmountProp;
	category?: OptionsProp<string>;
	manipulation?: OptionsProp<string>;
	children?: string;
}

export class Ingredient {
	key?: string;
	name?: string;
	amount?: Amount;
	category?: Options<string>;
	manipulation?: Options<string>;

	constructor(props: Props) {
		this.key = props.key;
		this.name = props.children ?? props.name;
		this.amount = new Amount(props.amount);
		this.category = new Options(props.category);
		this.manipulation = new Options(props.manipulation);
	}
}
