interface IMapOptions {
	concurrency: number;
}

const DEFAULT_OPTIONS: IMapOptions = {
	concurrency: 1
};

export const map = <I, R>(
	items: I[],
	mapFn: (item: I) => Promise<R>,
	options?: Partial<IMapOptions>
): Promise<R[]> => {
	const { concurrency }: IMapOptions = {
		...DEFAULT_OPTIONS,
		...options
	};

	if (items.length === 0) {
		return new Promise((resolve) => resolve([]));
	}

	const results: R[] = Array(items.length).fill(null);
	const trueConcurrencyLimit: number = Math.min(items.length, concurrency);

	let index: number;

	const iterablePromiseFn = (item: I, i: number) =>
		new Promise<R>((resolve, reject) =>
			mapFn(item)
				.then((result) => {
					results[i] = result;

					const isOutOfItems: boolean = index++ >= items.length - 1;

					return isOutOfItems
						? resolve()
						: resolve(iterablePromiseFn(items[index], index));
				})
				.catch(reject)
		);

	const rateLimitedProcessor = Array(trueConcurrencyLimit)
		.fill(null)
		.map((__, i) => {
			index = i;

			return iterablePromiseFn(items[i], i);
		});

	return Promise.all(rateLimitedProcessor).then(() => results);
};
