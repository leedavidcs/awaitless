export interface IFilterOptions {
    concurrency: number;
}
export declare const filter: <T>(items: T[], filterFn: (item: T, index: number) => Promise<boolean>, options?: Partial<IFilterOptions> | undefined) => Promise<T[]>;
