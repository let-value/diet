type CommaSeparated<T extends string, U extends T = T> = T extends string ? [U] extends [T] ? T : `${`${T},` | ""}${CommaSeparated<Exclude<U, T>>}` : T;
declare function parseOptions<TOptions extends string>(options: TOptions | TOptions[] | CommaSeparated<TOptions> | Options<TOptions>): TOptions[];
export declare class Options<TOptions extends string> extends Array<TOptions> {
    constructor(...args: Parameters<typeof parseOptions<TOptions>>);
}
export type OptionsProp<TOptions extends string> = ConstructorParameters<typeof Options<TOptions>>[number];
export {};
