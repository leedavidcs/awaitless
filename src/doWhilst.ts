interface IDoWhilstOptions<T> {
	initialValue: T;
	maxRetry: number;
}

const DEFAULT_OPTIONS: IDoWhilstOptions<any> = {
	initialValue: null,
	maxRetry: Infinity
};

export const doWhilst = <T>(
	fn: (current: T | null) => Promise<T> | T,
	condFn: (current: T | null) => Promise<boolean> | boolean,
	options?: Partial<IDoWhilstOptions<T | null>>
): Promise<T | null> => {
	const finalOptions = {
		...DEFAULT_OPTIONS,
		...options
	};

	let result: Promise<T | null> = Promise.resolve(finalOptions.initialValue);
	let retryCount: number = 0;

	const iterablePromiseFn = () =>
		new Promise<T | null>((resolve, reject) => {
			Promise.resolve(result).then((current) => {
				if (retryCount >= finalOptions.maxRetry) {
					reject(new Error("Reached maximum number of retries in doWhilst loop."));
				}

				result = Promise.resolve(fn(current));

				return Promise.resolve(result).then((next) =>
					Promise.resolve(condFn(next)).then((isOver) => {
						if (!isOver) {
							return resolve(result);
						}

						retryCount++;
						resolve(iterablePromiseFn());
					})
				);
			});
		});

	return iterablePromiseFn();
};
