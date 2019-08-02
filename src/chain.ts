type ChainPromiseFunc<A extends { [key: string]: any }, T> = (
	acc: Partial<A>,
	$break: (value: T) => IBreakValue<T>
) => T | Promise<T> | IBreakValue<T>;

type ChainAccumulator<A extends { [key in keyof Partial<A>]: any }> = {
	[key in keyof Partial<A>]: ChainPromiseFunc<A, A[key]>;
};

export interface IBreakValue<T> {
	__$break: true;
	breakValue: T;
}

const isChainPromiseFunc = <A extends { [key in keyof Partial<A>]: any }, T = any>(
	value
): value is ChainPromiseFunc<A, T> => typeof value === "function";

const isChainAccumulator = <A extends { [key in keyof Partial<A>]: any }>(
	value
): value is ChainAccumulator<A> => typeof value === "object" && typeof value !== "function";

const isBreak = <T = any>(value): value is IBreakValue<T> =>
	typeof value === "object" && value.__$break;

const breakChain = <T>(breakValue: T): IBreakValue<T> => ({ __$break: true, breakValue });

export const chain = <A extends { [key: string]: any }, R>(
	promiseFuncs: Array<ChainPromiseFunc<A, any> | ChainAccumulator<A>>
): Promise<R> => {
	if (promiseFuncs.length === 0) {
		return new Promise((resolve) => resolve());
	}

	const results: Partial<A> = {};
	let index: number = 0;

	const getNextFn = () => {
		const isOutOfFunc: boolean = ++index === promiseFuncs.length;

		return isOutOfFunc ? null : promiseFuncs[index];
	};

	const iterablePromiseFn = (fn: ChainPromiseFunc<A, any> | ChainAccumulator<A>) => {
		return new Promise((resolve, reject) => {
			const nextFn = getNextFn();

			if (isChainAccumulator<A>(fn)) {
				const keys: Array<keyof A> = Object.keys(fn);
				const fnResults = keys.map((key) => fn[key](results, breakChain));

				return Promise.all<A[keyof A]>(fnResults as any)
					.then((values) => {
						values.forEach((value, i) => {
							if (isBreak<A[keyof A]>(value)) {
								throw new Error("Cannot break in an accumulator object");
							}

							results[keys[i]] = value;
						});

						return nextFn ? resolve(iterablePromiseFn(nextFn)) : resolve();
					})
					.catch(reject);
			}

			if (isChainPromiseFunc<A>(fn)) {
				const result = fn(results, breakChain);

				if (isBreak<A[keyof A]>(result)) {
					return resolve(result.breakValue);
				}

				return nextFn ? resolve(iterablePromiseFn(nextFn)) : resolve(result);
			}

			reject("Values must either be an object or a function");
		});
	};

	return iterablePromiseFn(promiseFuncs[index]);
};
