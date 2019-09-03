export interface IWhilstOptions<T> {
    initialValue: T;
    maxRetry: number;
}
export declare const whilst: <T>(condFn: (current: T | null) => boolean | Promise<boolean>, fn: (current: T | null) => T | Promise<T>, options?: Partial<IWhilstOptions<T | null>> | undefined) => Promise<T | null>;
