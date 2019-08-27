import { whilst } from "../src";

describe("whilst", () => {
    it("Should iterate successfully", () => {
        expect.assertions(2);

        const mock: jest.Mock = jest.fn();

        return whilst<number>((value) => value !== null && value < 5, (value) => {
            return new Promise<number>((resolve) => {
                if (value === null) {
                    value = 0;
                }

                mock();

                setTimeout(() => resolve(++value), 500);
            });
        }, { initialValue: 0 }).then((result) => {
            expect(result).toBe(5);
            expect(mock).toBeCalledTimes(5);
        });
    });

    it("Should throw an error if maxRetry is hit first", () => {
        expect.assertions(2);

        return whilst<number>(() => true, (value) => {
            return new Promise<number>((resolve) => {
                if (value === null) {
                    value = 0;
                }

                setTimeout(() => resolve(++value), 500);
            });
        }, {
            initialValue: 0,
            maxRetry: 5
        }).catch((err) => {
            expect(err).toBeDefined();
            expect(err.message).toBe("Reached maximum number of retries in whilst loop.");
        });
    });
});
