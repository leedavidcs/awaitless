import { toPromise } from "../src/.";

describe("toPromise", () => {
	const fnWithCallback = (
		arg1: number,
		arg2: number,
		callback: (err: Error | string | null, result?: number) => void
	): void => callback(null, arg1 + arg2);

	const fnWithCallbackAndErrs = (
		arg: string,
		callback: (err: Error | string | null, result?: string) => void
	): void => {
		callback(new Error("Test error thrown!"));
	};

	it("Should convert a callback function to a promise function", () => {
		const fnWithPromise = toPromise<number>(fnWithCallback);

		expect(fnWithPromise(1, 2)).toHaveProperty("then");
	});

	it(
		"Should throw and error if the promisified function is called with an invalid number of " +
			"function arguments",
		() => {
			expect.assertions(2);

			const fnWithPromise = toPromise<number>(fnWithCallback);

			return fnWithPromise(1).catch((err) => {
				expect(err).not.toBe(null);
				expect(err).toBe(
					`Function fnWithCallback as promise requires 2 arguments. Received 1`
				);

				return null;
			});
		}
	);

	it("Should throw an error if the callback function throws an error", () => {
		expect.assertions(3);

		const fnWithPromiseAndErrs = toPromise<string>(fnWithCallbackAndErrs);

		return fnWithPromiseAndErrs("not json string").catch((err) => {
			expect(err).not.toBe(null);
			expect(err instanceof Error).toBeTruthy();
			expect(err.message).toBe("Test error thrown!");

			return null;
		});
	});
});
