const regexp = /(?<rawQuantity>\d+)(?<separator>\W+)?(?<rawUnit>\w+)?/;

export class Amount {
	quantity?: number;
	unit?: string;

	constructor(props: Amount) {
		this.quantity = props.quantity;
		this.unit = props.unit;
	}
}

export function parseAmount(options?: string | number | Amount) {
	if (options === undefined) {
		return undefined;
	}

	let quantity: number | undefined = undefined;
	let unit: string | undefined = undefined;

	if (typeof options === "number") {
		quantity = options;
	}

	if (typeof options === "string") {
		const match = options.match(regexp);
		const { rawQuantity, rawUnit } = match?.groups ?? {};

		quantity = rawQuantity ? Number(rawQuantity) : undefined;
		unit = rawUnit;
	}

	if (options instanceof Amount) {
		quantity = options.quantity;
		unit = options.unit;
	}

	return new Amount({ quantity, unit });
}

export type AmountProp = Parameters<typeof parseAmount>[number];
