export const reduce: {
	<T, I>(
		items: T[],
		reducerFn: (accumulator: I, current: T, index: number) => Promise<I>,
		initial: I
	): Promise<I>;
	<T>(items: T[], reducerFn: (accumulator: T, current: T, index: number) => Promise<T>): Promise<
		T
	>;
} = <T, I>(
	items: T[],
	reducerFn: (accumulator: T | I, current: T, index: number) => Promise<T | I>,
	initial?: I
): Promise<T | I> => {
	if (items.length === 0) {
		if (initial !== undefined) {
			return Promise.resolve(initial);
		}

		return Promise.reject(
			new TypeError("Reduce called with an empty array, and no initial value")
		);
	}

	let acc: T | I = initial !== undefined ? initial : items[0];
	let index: number = initial !== undefined ? 0 : 1;

	const iterablePromiseFn = (i: number) =>
		new Promise<T | I>((resolve, reject) => {
			const isOutOfItems: boolean = index++ >= items.length;

			if (isOutOfItems) {
				return resolve(acc);
			}

			return reducerFn(acc, items[i], i)
				.then((result) => {
					acc = result;

					resolve(iterablePromiseFn(index));
				})
				.catch(reject);
		});

	return iterablePromiseFn(index);
};
