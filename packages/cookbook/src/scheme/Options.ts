type CommaSeparated<T extends string, U extends T = T> = T extends string
	? [U] extends [T]
		? T
		: `${`${T},` | ""}${CommaSeparated<Exclude<U, T>>}`
	: T;

function parseOptions<TOptions extends string>(
	options: TOptions | TOptions[] | CommaSeparated<TOptions> | Options<TOptions>,
): TOptions[] {
	if (options === undefined) {
		return [];
	}

	if (options instanceof Options) {
		return [...options];
	}

	if (Array.isArray(options)) {
		return options;
	}

	return `${options}`.split(",").map((option) => option.trim() as TOptions);
}

export class Options<TOptions extends string> extends Array<TOptions> {
	constructor(...args: Parameters<typeof parseOptions<TOptions>>) {
		const optionsArray = parseOptions(...args);
		super(...optionsArray);
	}
}

export type OptionsProp<TOptions extends string> = ConstructorParameters<
	typeof Options<TOptions>
>[number];
