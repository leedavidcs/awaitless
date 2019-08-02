import { toPromise } from "../src/.";

describe("toPromise", () => {
	const fnWithCallback = (
		arg1: number,
		arg2: number,
		callback: (err: Error | string | null, result: number) => void
	): void => callback(null, arg1 + arg2);

	it("Should convert a callback function to a promise function", () => {
		const fnWithPromise = toPromise<number>(fnWithCallback);

		expect(fnWithPromise(1, 2)).toHaveProperty("then");
	});

	it(
		"Should throw and error if the promisified function is called with an invalid number of " +
			"function arguments",
		() => {
			const fnWithPromise = toPromise<number>(fnWithCallback);

			return fnWithPromise(1).catch((err) => expect(err).not.toBe(null));
		}
	);
});
