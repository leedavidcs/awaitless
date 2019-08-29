export declare const reduce: {
    <T, I>(items: T[], reducerFn: (accumulator: I, current: T, index: number) => Promise<I>, initial: I): Promise<I>;
    <T>(items: T[], reducerFn: (accumulator: T, current: T, index: number) => Promise<T>): Promise<T>;
};
