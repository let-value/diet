import { Quantity, parseQuantity } from "./Quantity";
import { joinStringChildren } from "./helpers";

interface MeasurementProps {
	scale?: boolean;
	value?: string;
	children?: string;
}

export class Measurement {
	scale?: boolean;
	quantity?: Quantity;

	constructor(props: MeasurementProps) {
		this.scale = props.scale;

		const quantity = joinStringChildren(props.children) ?? props.value;
		this.quantity = parseQuantity(quantity);
	}
}
