export declare function groupBy<T>(array: T[], getKey: (item: T) => string): {
    [key: string]: T[];
};
