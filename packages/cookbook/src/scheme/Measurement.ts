import { Quantity, parseQuantity } from "./Quantity";
import { joinStringChildren } from "./helpers";

interface Props {
	scale?: boolean;
	value?: string;
	children?: string;
}

export class Measurement {
	scale?: boolean;
	quantity?: Quantity;

	constructor(props: Props) {
		this.scale = props.scale;

		const quantity = joinStringChildren(props.children) ?? props.value;
		this.quantity = parseQuantity(quantity);
	}
}
