import { reduce } from "../src";

describe("reduce", () => {
	it("Should reduce successfully", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return reduce(["cat", "dog", "fish"], (acc, item) => {
			return new Promise<string>((resolve) => {
				mock();

				setTimeout(() => resolve(`${acc}${item}`), 200);
			});
		}).then((result) => {
			expect(result).toBe("catdogfish");
			expect(mock).toBeCalledTimes(2);
		});
	});

	it("Should reduce if there is an array of 1 item, and no initial value", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return reduce([1], (acc, item) => {
			return new Promise<number>((resolve) => {
				mock();

				setTimeout(() => resolve(acc + item * 2));
			});
		}).then((result) => {
			expect(result).toBe(1);
			expect(mock).not.toBeCalled();
		});
	});

	it("Should throw an error if array is empty, and no initial value", () => {
		expect.assertions(2);

		const mock: jest.Mock = jest.fn();

		return reduce<number>([], (acc, item) => {
			return new Promise<number>((resolve) => {
				mock();

				setTimeout(() => resolve(acc + item));
			});
		}).catch((err) => {
			expect(err).toBeDefined();
			expect(mock).not.toBeCalled();
		});
    });
    
    it("Should reduce with an initial item", () => {
        expect.assertions(2);

        const mock: jest.Mock = jest.fn();

        return reduce<number, string>([1, 2, 3], (acc, item) => {
            return new Promise<string>((resolve) => {
                mock();

                setTimeout(() => resolve(`${acc}${item}`), 200);
            });
        }, "").then((result) => {
            expect(result).toStrictEqual("123");
            expect(mock).toBeCalledTimes(3);
        });
    });

    it("Should resolve with initial item, if empty array", () => {
        expect.assertions(2);

        const mock: jest.Mock = jest.fn();

        return reduce<number, string>([], (acc, item) => {
            return new Promise<string>((resolve) => {
                mock();

                setTimeout(() => resolve(`${acc}${item}`), 200);
            });
        }, "").then((result) => {
            expect(result).toStrictEqual("");
            expect(mock).toBeCalledTimes(0);
        });
    });
});
