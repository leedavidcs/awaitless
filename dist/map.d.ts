interface IMapOptions {
    concurrency: number;
}
export declare const map: <I, R>(items: I[], mapFn: (item: I) => Promise<R>, options?: Partial<IMapOptions> | undefined) => Promise<R[]>;
export {};
