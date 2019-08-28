import { forEach } from "../src";

describe("forEach", () => {
	it("Should iterate successfully", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();
		const mappedItems: string[] = [];

		return forEach(
			["Cat", "Dog", "Giraffe"],
			(item) =>
				new Promise<void>((resolve, reject) => {
					mock();

					setTimeout(() => {
						mappedItems.push(`Mapped_${item}`);

						resolve();
					}, 200);
				})
		).then(() => {
			expect(mappedItems).toStrictEqual(["Mapped_Cat", "Mapped_Dog", "Mapped_Giraffe"]);
			expect(mock).toBeCalledTimes(3);
		});
	});

	it("Should still resolve if the items array is empty", () => {
		expect.assertions(1);

		const mock: jest.Mock = jest.fn();

		return forEach([], () => new Promise((resolve) => setTimeout(resolve, 200)))
			.then(mock)
			.then(() => expect(mock).toBeCalled());
	});

	it("Should iterate concurrently", () => {
		expect.assertions(1);

		const mappedItems: number[] = [];

		return forEach(
			[300, 200, 100],
			(value) =>
				new Promise((resolve) =>
					setTimeout(() => {
						mappedItems.push(value);

						resolve();
					}, value)
				),
			{ concurrency: 2 }
		).then(() => {
			expect(mappedItems).toStrictEqual([200, 300, 100]);
		});
	});
});
