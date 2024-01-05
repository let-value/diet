const regexp = /(?<count>\d+)(?<separator>\W+)?(?<unit>\w+)?/;

export class Amount {
	count?: number;
	unit?: string;

	constructor(options: string | Amount = "") {
		if (typeof options === "string") {
			const match = options.match(regexp);
			const { count, unit } = match?.groups ?? {};

			this.count = count ? Number(count) : undefined;
			this.unit = unit;
		}

		if (options instanceof Amount) {
			this.count = options.count;
			this.unit = options.unit;
		}
	}
}

export type AmountProp = ConstructorParameters<typeof Amount>[number];
