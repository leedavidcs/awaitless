interface IForEachOptions {
	concurrency: number;
}

const DEFAULT_OPTIONS: IForEachOptions = {
	concurrency: 1
};

export const forEach = <I>(
	items: I[],
	forEachFn: (item: I, index: number) => Promise<any>,
	options?: Partial<IForEachOptions>
): Promise<void> => {
	const { concurrency }: IForEachOptions = {
		...DEFAULT_OPTIONS,
		...options
	};

	if (items.length === 0) {
		return new Promise((resolve) => resolve());
	}

	const trueConcurrencyLimit: number = Math.min(items.length, concurrency);

	let index: number;

	const iterablePromiseFn = (item: I, i: number) =>
		new Promise<void>((resolve, reject) =>
			forEachFn(item, i)
				.then(() => {
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

	return Promise.all(rateLimitedProcessor).then();
};
