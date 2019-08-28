import { doWhilst } from "../src";

describe("doWhilst", () => {
	it("Should iterate successfully", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return doWhilst<number>(
			(value) => {
				return new Promise<number>((resolve) => {
					if (value === null) {
						value = 0;
					}

					mock();

					setTimeout(() => resolve(++value), 200);
				});
			},
			(value) => value !== null && value < 5,
			{ initialValue: 0 }
		).then((result) => {
			expect(result).toBe(5);
			expect(mock).toBeCalledTimes(5);
		});
	});

	it("Should throw an error if maxRetry is hit first", () => {
		expect.assertions(2);

		return doWhilst<number>(
			(value) => {
				return new Promise<number>((resolve) => {
					if (value === null) {
						value = 0;
					}

					setTimeout(() => resolve(++value), 200);
				});
			},
			() => true,
			{
				initialValue: 0,
				maxRetry: 5
			}
		).catch((err) => {
			expect(err).toBeDefined();
			expect(err.message).toBe("Reached maximum number of retries in doWhilst loop.");

			return null;
		});
	});
});
