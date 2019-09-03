export interface IDoWhilstOptions<T> {
    initialValue: T;
    maxRetry: number;
}
export declare const doWhilst: <T>(fn: (current: T | null) => T | Promise<T>, condFn: (current: T | null) => boolean | Promise<boolean>, options?: Partial<IDoWhilstOptions<T | null>> | undefined) => Promise<T | null>;
