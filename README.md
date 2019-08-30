# Awaitless
[![npm](https://img.shields.io/npm/v/awaitless)](https://www.npmjs.com/package/awaitless)
[![GitHub](https://img.shields.io/github/license/leedavidcs/awaitless)](https://github.com/leedavidcs/awaitless)
[![Build Status](https://travis-ci.com/leedavidcs/awaitless.svg?branch=master)](https://travis-ci.com/leedavidcs/awaitless)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=leedavidcs_awaitless&metric=alert_status)](https://sonarcloud.io/dashboard?id=leedavidcs_awaitless)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=leedavidcs_awaitless&metric=coverage)](https://sonarcloud.io/dashboard?id=leedavidcs_awaitless)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=leedavidcs_awaitless&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=leedavidcs_awaitless)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=leedavidcs_awaitless&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=leedavidcs_awaitless)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=leedavidcs_awaitless&metric=security_rating)](https://sonarcloud.io/dashboard?id=leedavidcs_awaitless)

Awaitless is a lightweight, zero-dependency Promises utility that provides a set of useful operations on Promises, geared towards projects that do not have access to async-await.

This is particularly useful for projects that transpile from a pre-ES6 versioned language, but target newer browsers or run on a more up-to-date version of Node that still supports Promises.

### Table of Contents
- [Awaitless](#awaitless)
    + [Table of Contents](#table-of-contents)
  * [Notes](#notes)
  * [Documentation](#documentation)
    + [default](#default)
    + [chain](#chain)
    + [doWhilst](#doWhilst)
    + [filter](#filter)
    + [forEach](#forEach)
    + [map](#map)
    + [reduce](#reduce)
    + [toPromise](#toPromise)
    + [whilst](#whilst)

## Notes
This module does not supply a promises implementation, but only provides a set of useful operations for promises. It is recommended to take any of the [many promises implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md#standalone) before using this module, if your project does not have promises already.

This project uses `Promise` directly, so if you are using a promises implementation, make sure to overwrite `Promise` to the implementation you've chosen.

This project implements none of the provided functions using async/await.

## Documentation

### default
* method: `default(promiseFuncs)`
* description: This is the same as `chain`, but can also be used to access any of the methods below:
* params: (see `chain`)
* example:
  ```ts
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
### chain
* method: `chain(promiseFuncs)`
* description: This is functionally the same as promise chaining, but supports a clean signature for parallelly ran promises, variable assignment, and breaking and returning early out of the promise chain.
* params:
  * `promiseFuncs`: An array of either objects mapped to functions, or functions.
* returns: `Promise<any>`
* example:
  * Standard use:
    ```ts
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
    ```ts
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
    ```ts
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
    ]).then((result) =>
        // result is the value of thing0
    );
    ```
### doWhilst
* method: `doWhilst(promiseFn, condFn, options)`
* description: The post-check version of whilst.
* params:
  * `promiseFn`: A function (typed `(currentValue: any) => Promise<any>`) which is called each time `condFn` passes. Passes the previous return value of `promiseFn`.
  * `condFn`: A function which returns `Promise<boolean> | boolean` that takes the last return value of `promiseFn` that is run after each execution of `promiseFn`.
  * `options`: An optional options object
    * `initialValue` (`any`, default: `null`): The initial value to invoke `promiseFn` with.
    * `maxRetry` (`number`, default: `Infinity`): The number of times to retry, until an error is thrown.
* returns: `Promise<any>`
* example:
  ```ts
  import { doWhilst } from "awaitless";

  doWhilst(
    (current) => new Promise((resolve) => setTimeout(() => resolve(++current), 1000)),
    (current) => current < 5,
    { initialValue: 0 }
  ).then((result) => result === 5);
  ```
### filter
* method: `filter(items, filterFn, options)`
* description: Iterates over an array of items, and invokes a filter function that returns a boolean promise to determine whether to filter each time. Filtered items maintain their original order (this is not the same as index, because the result array will be of equal or smaller length).
* params:
  * `items`: An array of anything
  * `filterFn`: A function (typed `(item: any, index: number) => Promise<boolean>`) that gets invoked with each item.
  * `options`: An optional options object
    * `concurrency` (`number`, default: `1`): Runs the `filterFn` with the specified concurrency limit. If everything should be parallel, set this to `Infinity`. `filter` will still respect the original order of items, regardless of when order each item is completed.
* returns: `Promise<any[]>`
### forEach
* method: `forEach(items, promiseFn, options)`
* description: Iterates over an array of items, and invokes a function that returns a promise for each item.
* params:
  * `items`: An array of anything
  * `promiseFn`: A function (typed `(item: any, index: number) => Promise<void>`), that gets invoked with each item
  * `options`: An optional options object
    * `concurrency` (`number`, default: `1`): Runs the `promiseFn` with the specified concurrency limit. If everything should be parallel, set this to `Infinity`.
* returns: `Promise<void>`
* example
  ```ts
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
### map
* method: `map(items, promiseFn, options)`
* description: Iterates over an array of items, and invokes a function that returns a promise to map each item. This will return items in the same order, regardless of what order the items complete.
* params:
  * `items`: An array of anything
  * `promiseFn`: A function (typed `(item: any, index: number) => Promise<any>`), that gets invoked with each item
  * `options`: An optional options object
    * `concurrency` (`number`, default: `1`): Runs the `promiseFn` with the specified concurrency limit. If everything should be parallel, set this to `Infinity`.
* returns: `Promise<any[]>`
* example
  ```ts
  import { map } from "awaitless";

  map(
      [300, 200, 100],
      (value) => new Promise((resolve) => setTimeout(() => resolve(value), value)),
      { concurrency: 2 }
    ).then((result) => // result is [300, 200, 100]);
  ```
### reduce
* method: `reduce(items, reduceFn, initialValue)`
* description: Iterates over an array of items, and invokes a reducer function that returns a promise to reduce the items. This is nearly identical to [`Array.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), except is designed to work with a promise function.
* params:
  * `items`: An array of anything
  * `reduceFn`: A function (typed `(accumulator: any, item: any, index: number) => Promise<any>`), that gets invoked with the current accumulated value and each item.
  * `initialValue`: An optional initial value to use as the first argument to the `reduceFn`. If undefined, the first element will be used as the `initialValue` and skipped in the first call of the `reduceFn`.
* returns: `Promise<any>`
* example:
  ```ts
  import { reduce } from "awaitless";

  reduce(
    [1, 2, 3],
    (acc, item) => new Promise((resolve) => setTimeout(() => resolve(`${acc}${item}`), 1000)),
    ""
  ).then((result) => result === "123");
  ```
### toPromise
* method: `toPromise(fn, thisArg)`
* description: Converts a callback function to a promise function.
* params:
  * `fn`: A function with a callback (typed as `(err: Error | string | null, result: any) => void`) as a last parameter.
  * `thisArg?`: An object to bind `this` to, if needed
* returns: `(...args: any[]) => Promise<any>`
* example:
  ```ts
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
### whilst
* method: `whilst(condFn, promiseFn, options)`
* description: Repeatedly calls `promiseFn` while `condFn` returns `true`. This returns that last return value of `promiseFn`
* params:
  * `condFn`: A function which returns `Promise<boolean> | boolean` that takes the last return value of `promiseFn` that is run after each execution of `promiseFn`.
  * `promiseFn`: A function (typed `(currentValue: any) => Promise<any>`) which is called each time `condFn` passes. Passes the previous return value of `promiseFn`.
  * `options`: An optional options object
    * `initialValue` (`any`, default: `null`): The initial value to invoke `promiseFn` with.
    * `maxRetry` (`number`, default: `Infinity`): The number of times to retry, until an error is thrown.
* returns: `Promise<any>`
* example:
  ```ts
  import { whilst } from "awaitless";

  whilst(
    (current) => current < 5,
    (current) => new Promise((resolve) => setTimeout(() => resolve(++current), 1000)),
    { initialValue: 0 }
  ).then((result) => result === 5);
  ```
  