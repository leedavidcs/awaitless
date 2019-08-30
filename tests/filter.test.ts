import { filter } from "../src";

describe("filter", () => {
	it("Should filter successfully", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return filter(
			[1, 2, 3],
			(item) =>
				new Promise<boolean>((resolve) => {
					mock();

					setTimeout(() => resolve(item > 1), 200);
				})
		).then((result) => {
			expect(result).toEqual([2, 3]);
			expect(mock).toBeCalledTimes(3);
		});
	});

	it("Should still resolve if the items array is empty", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return filter(
			[],
			() =>
				new Promise((resolve) => {
					mock();

					setTimeout(resolve, 200);
				})
		)
			.then((result) => expect(result).toEqual([]))
			.then(mock)
			.then(() => expect(mock).toBeCalledTimes(1));
	});

	it("Should preserve order when filtering concurrently", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return filter(
			[50, 20, 300, 30, 100],
			(item) =>
				new Promise<boolean>((resolve) => {
					mock();

					setTimeout(() => resolve(item >= 50), item);
				}),
			{ concurrency: 2 }
		).then((result) => {
			expect(result).toEqual([50, 300, 100]);
			expect(mock).toBeCalledTimes(5);
		});
	});
});
