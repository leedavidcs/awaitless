declare type ChainPromiseFunc<
	A extends {
		[key: string]: any;
	},
	T
> = (acc: Partial<A>, $break: (value: T) => IBreakValue<T>) => T | Promise<T> | IBreakValue<T>;
declare type ChainAccumulator<
	A extends {
		[key in keyof Partial<A>]: any;
	}
> = {
	[key in keyof Partial<A>]: ChainPromiseFunc<A, A[key]>;
};
export interface IBreakValue<T> {
	__$break: true;
	breakValue: T;
}
export declare const chain: <
	A extends {
		[key: string]: any;
	},
	R
>(
	promiseFuncs: (ChainPromiseFunc<A, any> | ChainAccumulator<A>)[]
) => Promise<R>;
export {};
