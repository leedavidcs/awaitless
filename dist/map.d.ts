export interface IMapOptions {
    concurrency: number;
}
export declare const map: <I, R>(items: I[], mapFn: (item: I, index: number) => Promise<R>, options?: Partial<IMapOptions> | undefined) => Promise<R[]>;
