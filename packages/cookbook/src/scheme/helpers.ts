export function joinStringChildren(children?: string | string[]) {
	if (children === undefined) {
		return undefined;
	}

	if (typeof children === "string") {
		return children;
	}

	if (!children.length) {
		return undefined;
	}

	return children.join("");
}
