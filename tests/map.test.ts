import { map } from "../src";

describe("map", () => {
	it("Should map successfully", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return map(
			["Cat", "Dog", "Giraffe"],
			(item) =>
				new Promise<string>((resolve) => {
					mock();

					setTimeout(() => resolve(`Mapped_${item}`), 1000);
				})
		).then((mappedItems) => {
			expect(mappedItems).toStrictEqual(["Mapped_Cat", "Mapped_Dog", "Mapped_Giraffe"]);
			expect(mock).toBeCalledTimes(3);
		});
	});

	it("Should still resolve if the items array is empty", () => {
		expect.assertions(1);

		const mock: jest.Mock = jest.fn();

		return map([], () => new Promise((resolve) => setTimeout(resolve, 1000)))
			.then(mock)
			.then(() => expect(mock).toBeCalled());
	});

	it("Should map concurrently", () => {
		expect.assertions(1);

		return map(
			[300, 200, 100],
			(value) => new Promise((resolve) => setTimeout(() => resolve(value), value)),
			{ concurrency: 2 }
		).then((result) => {
			expect(result).toStrictEqual([300, 200, 100]);
		});
	});
});
