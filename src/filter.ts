interface IFilterOptions {
	concurrency: number;
}

const DEFAULT_OPTIONS: IFilterOptions = {
	concurrency: 1
};

export const filter = <T>(
	items: T[],
	filterFn: (item: T, index: number) => Promise<boolean>,
	options?: Partial<IFilterOptions>
): Promise<T[]> => {
	const { concurrency }: IFilterOptions = {
		...DEFAULT_OPTIONS,
		...options
	};

	if (items.length === 0) {
		return Promise.resolve([]);
	}

	const results: Array<[boolean, T]> = [];
	const trueConcurrencyLimit: number = Math.min(items.length, concurrency);

	let index: number;

	const iterablePromiseFn = (item: T, i: number) =>
		new Promise<void>((resolve, reject) => {
			filterFn(item, i).then((result) => {
				results[i] = [result, item];

				const isOutOfItems: boolean = index++ >= items.length - 1;

				return isOutOfItems ? resolve() : resolve(iterablePromiseFn(items[index], index));
			});
		});

	const rateLimitedProcessor = Array(trueConcurrencyLimit)
		.fill(null)
		.map((__, i) => {
			index = i;

			return iterablePromiseFn(items[i], i);
		});

	return Promise.all(rateLimitedProcessor).then(() => {
		return results.filter(([shouldFilter]) => shouldFilter).map(([, item]) => item);
	});
};
