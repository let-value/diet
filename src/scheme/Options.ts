type CommaSeparated<T extends string, U extends T = T> = T extends string
	? [U] extends [T]
		? T
		: `${`${T},` | ""}${CommaSeparated<Exclude<U, T>>}`
	: T;

export class Options<TOptions extends string> extends Array<TOptions> {
	constructor(
		options:
			| TOptions
			| TOptions[]
			| CommaSeparated<TOptions>
			| Options<TOptions>,
	) {
		const optionsArray =
			options instanceof Options
				? [...options]
				: Array.isArray(options)
				  ? options
				  : `${options}`.split(",").map((option) => option.trim());

		super(...optionsArray);
	}
}

export type OptionsProp<TOptions extends string> = ConstructorParameters<
	typeof Options<TOptions>
>[number];
