interface IForEachOptions {
    concurrency: number;
}
export declare const forEach: <I>(items: I[], forEachFn: (item: I, index: number) => Promise<any>, options?: Partial<IForEachOptions> | undefined) => Promise<void>;
export {};
