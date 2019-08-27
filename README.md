# Awaitless
Awaitless is a lightweight, zero-dependency Promises utility that provides a set of useful operations on Promises, geared towards projects that do not have access to async-await.

This is particularly useful for projects that transpile from a pre-ES6 versioned language, but target newer browsers or run on a more up-to-date version of Node that still supports Promises.

## Documentation
### `awaitless(promiseFuncs)`
* description: This is the same as `chain`, but can also be used to access any of the methods below:
* params: (see `chain`)
* example:
  ```
  import awaitless from "awaitless";
  
  /**
   * These exist:
   * - awaitless.chain
   * - awaitless.doWhilst
   * - awaitless.forEach
   * - awaitless.map
   * - awaitless.toPromise
   * - awaitless.whilst
   */
  
  awaitless([
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
  ]).then((result) => result === "CatDogGiraffeCamelTurtle");
  ```
### `chain(promiseFuncs)`
* description: This is functionally the same as promise chaining, but supports a clean signature for parallelly ran promises, variable assignment, and breaking and returning early out of the promise chain.
* params:
  * `promiseFuncs`: An array of either objects mapped to functions, or functions.
* example:
  * Standard use:
    ```
    import { chain } from "awaitless";

    chain([
        // These execute in parallel
        {
            thing0: () => "Cat",
            thing1: () => new Promise((resolve) => setTimeout(() => resolve("Dog"), 1000)),
            thing2: () => new Promise((resolve) => setTimeout(() => resolve("Giraffe"), 2000))
        },
        // Assignments will be available in all subsequent promiseFuncs functions.
        ({ thing0, thing2 }) => expect(`${thing0}${thing2}`).toBe("CatGiraffe"),
        {
            thing3: ({ thing0 }) => `${thing0}fish`,
            thing4: () => new Promise((resolve) => setTimeout(() => resolve("Turtle"), 1000))
        },
        // Results from assignment objects are available in all subsequent functions
        ({ thing0, thing1, thing2, thing3, thing4 }) =>
            `${thing0}${thing1}${thing2}${thing3}${thing4}`
    ]).then((result) => result === "CatDogGiraffeCatfishTurtle");
    ```
  * Breaking the promise chain:
    ```
    import { chain } from "awaitless";

    chain([
        { thing0: () => new Promise((resolve) => setTimeout(() => resolve("Dog"), 1000)) },
        // This will terminate the promise chain and resolve with the value of thing0 ("Dog")
        ({ thing0 }, { $break }) => $break(thing0),
        // This will not execute
        () => console.log("Hello!"),
        // Cannot break in an assignment object, must break in a function
        { thing1: (__, { $break }) => $break("This will throw an error!") }
    ]).then((result) => result === "Dog");
    ```
  * Assigning manually (not recommended):
    ```
    import { chain } from "awaitless";

    chain([
        { 
            thing0: (__, { $assign }) => {
                return new Promise((resolve) => {
                    try {
                        resolve(promiseFnThatMightError("Dog"));
                    } catch (err) {
                        $assign("didError", true);
                    }
                })
            }
        },
        // Unlike $break, $assign is available in non-assignment objects as well
        ({ thing0, didError = false }, { $assign }) => {
            if (didError) {
                // Do something
            } else {
                return thing0;
            }
        }
    ]).then((result) => // result is the value of thing0);
    ```
### `doWhilst(fn, condFn, options)`
* description: The post-check version of whilst.
* params
  * `fn`: A function (typed `(currentValue: any) => any`) which is called each time `condFn` passes. Passes the previous return value of `fn`.
  * `condFn`: A function which returns `Promise<boolean> | boolean` that takes the last return value of `fn` that is run after each execution of `fn`.
  * `options`: An optional options object
    * `initialValue` (any, default: null): The initial value to invoke `fn` with.
    * `maxRetry` (number, default: Infinity): The number of times to retry, until an error is thrown.
* example:
  ```
  import { doWhilst } from "awaitless";

  doWhilst(
    (current) => new Promise((resolve) => setTimeout(() => resolve(++current), 1000)),
    (current) => current < 5,
    { initialValue: 0 }
  ).then((result) => // result === 5);
  ```
### `forEach(items, promiseFn, options)`
* description: Iterates over an array of items, and invokes a function that returns a promise for each item.
* params
  * `items`: An array of anything
  * `promiseFn`: A function (typed `(item: any, index: number) => void`), that gets invoked with each item
  * `options`: An optional options object
    * `concurrency` (number, default: 1): Runs the `promiseFn` with the specified concurrency limit. If everything should be parallel, set this to `Infinity`.
* example
  ```
  import { forEach } from "awaitless";

  const result = [];

  forEach(
      [300, 200, 100],
      (value) => new Promise((resolve) => setTimeout(() => {
          result.push(value);
          
          resolve();
      }, value)),
      { concurrency: 2 }
    ).then(() => // result is [200, 300, 100]);
  ```
### `map(items, promiseFn, options)`
* description: Iterates over an array of items, and invokes a function that returns a promise to map each item. This will return items in the same order, regardless of what order the items complete.
* params
  * `items`: An array of anything
  * `promiseFn`: A function (typed `(item: any, index: number) => any`), that gets invoked with each item
  * `options`: An optional options object
    * `concurrency` (number, default: 1): Runs the `promiseFn` with the specified concurrency limit. If everything should be parallel, set this to `Infinity`.
* example
  ```
  import { map } from "awaitless";

  map(
      [300, 200, 100],
      (value) => new Promise((resolve) => setTimeout(() => resolve(value), value)),
      { concurrency: 2 }
    ).then((result) => // result is [300, 200, 100]);
  ```
### `toPromise(fn, thisArg)`
* description: Converts a callback function to a promise function.
* params
  * `fn`: A function with a callback (typed as `(err: Error | string | null, result: any) => void`) as a last parameter.
  * `thisArg?`: An object to bind `this` to, if needed
* example:
  ```
  import { toPromise } from "awaitless";
  
  const fnWithCallback = (firstName, lastName, callback) => {
      setTimeout(() => {
          const isBadName = firstName === "badName";
  
          if (isBadName) {
              callback("Error: Name is bad name");
          }
  
          callback(null, `${firstName}_${lastName}`);
      }, 1000);
  };
  
  const promisifiedFn = toPromise(fnWithCallback);
  
  promisifiedFn("Bobbathan", "Dole")
      .then((result) => result === "Bobbathan_Dole")
      .catch((err) => console.log(err));
  ```
### `whilst(condFn, fn, options)`
* description: Repeatedly calls `fn` while `condFn` returns `true`. This returns that last return value of `fn`
* params
  * `condFn`: A function which returns `Promise<boolean> | boolean` that takes the last return value of `fn` that is run after each execution of `fn`.
  * `fn`: A function (typed `(currentValue: any) => any`) which is called each time `condFn` passes. Passes the previous return value of `fn`.
  * `options`: An optional options object
    * `initialValue` (any, default: null): The initial value to invoke `fn` with.
    * `maxRetry` (number, default: Infinity): The number of times to retry, until an error is thrown.
* example:
  ```
  import { whilst } from "awaitless";

  whilst(
    (current) => current < 5,
    (current) => new Promise((resolve) => setTimeout(() => resolve(++current), 1000)),
    { initialValue: 0 }
  ).then((result) => // result === 5);
  ```
  