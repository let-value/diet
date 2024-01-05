export function jsx<T, P>(
	tag: { new (props: P): T },
	props: P,
	...children: unknown[]
) {
	return new tag({ ...props, children });
}
