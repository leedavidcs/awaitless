interface IWhilstOptions<T> {
	initialValue: T;
	maxRetry: number;
}

const DEFAULT_OPTIONS: IWhilstOptions<any> = {
	initialValue: null,
	maxRetry: Infinity
};

export const whilst = <T>(
	condFn: (current: T | null) => Promise<boolean> | boolean,
	fn: (current: T | null) => Promise<T> | T,
	options?: Partial<IWhilstOptions<T | null>>
): Promise<T | null> => {
	const finalOptions = {
		...DEFAULT_OPTIONS,
		...options
	};

	let result: Promise<T | null> = Promise.resolve(finalOptions.initialValue);
	let retryCount: number = 0;

	const iterablePromiseFn = () =>
		new Promise<T | null>((resolve, reject) => {
			Promise.resolve(result).then((current) =>
				Promise.resolve(condFn(current)).then((isOver) => {
					if (!isOver) {
						return resolve(result);
					}

					if (retryCount >= finalOptions.maxRetry) {
						reject(new Error("Reached maximum number of retries in whilst loop."));
					}

					result = Promise.resolve(fn(current));

					retryCount++;
					resolve(iterablePromiseFn());
				})
			);
		});

	return iterablePromiseFn();
};
