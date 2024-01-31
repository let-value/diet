export function groupBy<T>(
	array: T[],
	getKey: (item: T) => string,
): { [key: string]: T[] } {
	const grouped: { [key: string]: T[] } = {};

	for (const item of array) {
		const key = getKey(item);
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(item);
	}

	return grouped;
}
