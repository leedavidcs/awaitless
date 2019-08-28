import { chain } from "../src/.";

describe("chain", () => {
	it("Should chain and return an accumulated value", () => {
		expect.assertions(2);

		return chain<
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
				thing1: () => new Promise((resolve) => setTimeout(() => resolve("Dog"), 100)),
				thing2: () => new Promise((resolve) => setTimeout(() => resolve("Giraffe"), 200))
			},
			({ thing0, thing2 }) => expect(`${thing0}${thing2}`).toBe("CatGiraffe"),
			{
				thing3: ({ thing0 }) => `${thing0}fish`,
				thing4: () => new Promise((resolve) => setTimeout(() => resolve("Turtle"), 100))
			},
			({ thing0, thing1, thing2, thing3, thing4 }) =>
				`${thing0}${thing1}${thing2}${thing3}${thing4}`
		]).then((result) => expect(result).toBe("CatDogGiraffeCatfishTurtle"));
	});

	it("Should chain and return a break value", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return chain<{}, string>([
			(__, { $break }) =>
				new Promise((resolve) => setTimeout(resolve, 100)).then(() => $break("Cat")),
			(__, { $break }) => $break("Giraffe"),
			() => {
				mock();
				return "Dog";
			}
		]).then((result) => {
			expect(result).toBe("Cat");
			expect(mock).not.toBeCalled();
		});
	});

	it("Should throw an error if bad type is provided", () => {
		expect.assertions(1);

		return chain<{}, string>(["This is not a correctly typed parameter"]).catch((err) =>
			expect(err).not.toBe(null)
		);
	});

	it("Should throw an error if the accumulator invokes breakChain", () => {
		expect.assertions(1);

		return chain<{ thing0: string }, string>([
			{
				thing0: (__, { $break }) => $break("This is a bad break call")
			}
		]).catch((err) => expect(err).not.toBe(null));
	});

	it("Should assign to the accumulator intermediately", () => {
		expect.assertions(1);

		return chain<
			{
				thing0: string;
				thing1: string;
			},
			string
		>([
			{
				thing0: (__, { $assign }) =>
					new Promise((resolve) => {
						$assign("thing1", "Dog");

						setTimeout(() => resolve("Cat"), 100);
					})
			},
			({ thing1 }) => expect(thing1).toBe("Dog")
		]);
	});

	it("Should still resolve if the parameter array is empty", () => {
		expect.assertions(1);

		const mock: jest.Mock = jest.fn();

		return chain<{}, string>([])
			.then(mock)
			.then(() => expect(mock).toBeCalled());
	});

	it("Should not return any value if the final promise fn is an accumulator", () => {
		expect.assertions(2);

		return chain<
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
				thing1: () => new Promise((resolve) => setTimeout(() => resolve("Dog"), 100)),
				thing2: () => new Promise((resolve) => setTimeout(() => resolve("Giraffe"), 200))
			},
			({ thing0, thing2 }) => expect(`${thing0}${thing2}`).toBe("CatGiraffe"),
			{
				thing3: ({ thing0 }) => `${thing0}fish`,
				thing4: () => new Promise((resolve) => setTimeout(() => resolve("Turtle"), 100))
			}
		]).then((result) => expect(result).toBeUndefined());
	});
});
