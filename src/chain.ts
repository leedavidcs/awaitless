export interface IChainPromiseFuncOps<A extends { [key: string]: any }, T = any> {
	$assign: (key: keyof Partial<A>, value: T) => void;
	$break: (value: T) => IBreakValue<T>;
}

export type ChainPromiseFunc<A extends { [key: string]: any }, T> = (
	acc: Partial<A>,
	ops: IChainPromiseFuncOps<A, T>
) => T | Promise<T> | IBreakValue<T>;

export type ChainAccumulator<A extends { [key in keyof Partial<A>]: any }> = {
	[key in keyof Partial<A>]: ChainPromiseFunc<A, A[key]>;
};

type PromiseFuncs<A> = Array<ChainPromiseFunc<A, any> | ChainAccumulator<A>>;

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
	Boolean(value) && typeof value === "object" && value.__$break;

const $break = <T>(breakValue: T): IBreakValue<T> => ({ __$break: true, breakValue });

export const chain = <A extends { [key: string]: any }, R>(
	promiseFuncs: PromiseFuncs<A>
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

	const $assign: IChainPromiseFuncOps<A, A[keyof A]>["$assign"] = (
		key: keyof A,
		value: A[keyof A]
	) => (results[key] = value);

	const funcOps: IChainPromiseFuncOps<A, A[keyof A]> = { $assign, $break };

	const iterablePromiseFn = (fn: ChainPromiseFunc<A, any> | ChainAccumulator<A>) => {
		return new Promise((resolve, reject) => {
			const nextFn = getNextFn();

			if (isChainAccumulator<A>(fn)) {
				const keys: Array<keyof A> = Object.keys(fn);
				const fnResults = keys.map((key) => fn[key](results, funcOps));

				return Promise.all<A[keyof A]>(fnResults as any)
					.then((values) => {
						values.forEach((value, i) => {
							if (isBreak<A[keyof A]>(value)) {
								return reject(new Error("Cannot break in an accumulator object"));
							}

							results[keys[i]] = value;
						});

						return nextFn ? resolve(iterablePromiseFn(nextFn)) : resolve();
					})
					.catch(reject);
			}

			if (isChainPromiseFunc<A>(fn)) {
				const result = fn(results, funcOps);

				return Promise.resolve(result).then((resolvedResult) => {
					if (isBreak<A[keyof A]>(resolvedResult)) {
						return resolve(resolvedResult.breakValue);
					}

					return nextFn ? resolve(iterablePromiseFn(nextFn)) : resolve(result);
				});
			}

			return reject("Values must either be an object or a function");
		});
	};

	return iterablePromiseFn(promiseFuncs[index]);
};
