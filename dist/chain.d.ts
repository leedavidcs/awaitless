interface IChainPromiseFuncOps<A extends {
    [key: string]: any;
}, T = any> {
    $assign: (key: keyof Partial<A>, value: T) => void;
    $break: (value: T) => IBreakValue<T>;
}
declare type ChainPromiseFunc<A extends {
    [key: string]: any;
}, T> = (acc: Partial<A>, ops: IChainPromiseFuncOps<A, T>) => T | Promise<T> | IBreakValue<T>;
declare type ChainAccumulator<A extends {
    [key in keyof Partial<A>]: any;
}> = {
    [key in keyof Partial<A>]: ChainPromiseFunc<A, A[key]>;
};
export interface IBreakValue<T> {
    __$break: true;
    breakValue: T;
}
export declare const chain: <A extends {
    [key: string]: any;
}, R>(promiseFuncs: (ChainPromiseFunc<A, any> | ChainAccumulator<A>)[]) => Promise<R>;
export {};
