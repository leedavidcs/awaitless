import awaitless from "../src/.";

describe("awaitless", () => {
	it("Should be chain underneath", () => {
		return awaitless<
			{
				thing0: string;
				thing1: string;
				thing2: string;
				thing3: string;
				thing4: string;
			},
			string
		>([
			{
				thing0: () => "Cat",
				thing1: () => new Promise((resolve) => setTimeout(() => resolve("Dog"), 1000)),
				thing2: () => new Promise((resolve) => setTimeout(() => resolve("Giraffe"), 2000))
			},
			({ thing0, thing2 }) => expect(`${thing0}${thing2}`).toBe("CatGiraffe"),
			{
				thing3: () => "Camel",
				thing4: () => new Promise((resolve) => setTimeout(() => resolve("Turtle"), 1000))
			},
			({ thing0, thing1, thing2, thing3, thing4 }) =>
				`${thing0}${thing1}${thing2}${thing3}${thing4}`
		]).then((result) => expect(result).toBe("CatDogGiraffeCamelTurtle"));
	});

	it("Should have all other properties", () => {
		const properties = Object.keys(awaitless);

		expect(properties.length).toBe(5);

		expect(awaitless.chain).toBeDefined();
		expect(awaitless.forEach).toBeDefined();
		expect(awaitless.map).toBeDefined();
		expect(awaitless.toPromise).toBeDefined();
		expect(awaitless.whilst).toBeDefined();
	});
});
