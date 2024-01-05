export class Options extends Array<string> {
	constructor(options: string | string[] | Options = "") {
		const optionsArray =
			options instanceof Options
				? [...options]
				: Array.isArray(options)
				  ? options
				  : options.split(",").map((option) => option.trim());

		super(...optionsArray);
	}
}

export type OptionsProp = ConstructorParameters<typeof Options>[number];
