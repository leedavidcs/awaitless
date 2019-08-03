"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isChainPromiseFunc = function (value) { return typeof value === "function"; };
var isChainAccumulator = function (value) { return typeof value === "object" && typeof value !== "function"; };
var isBreak = function (value) {
    return typeof value === "object" && value.__$break;
};
var $break = function (breakValue) { return ({ __$break: true, breakValue: breakValue }); };
exports.chain = function (promiseFuncs) {
    if (promiseFuncs.length === 0) {
        return new Promise(function (resolve) { return resolve(); });
    }
    var results = {};
    var index = 0;
    var getNextFn = function () {
        var isOutOfFunc = ++index === promiseFuncs.length;
        return isOutOfFunc ? null : promiseFuncs[index];
    };
    var $assign = function (key, value) { return (results[key] = value); };
    var funcOps = { $assign: $assign, $break: $break };
    var iterablePromiseFn = function (fn) {
        return new Promise(function (resolve, reject) {
            var nextFn = getNextFn();
            if (isChainAccumulator(fn)) {
                var keys_1 = Object.keys(fn);
                var fnResults = keys_1.map(function (key) { return fn[key](results, funcOps); });
                return Promise.all(fnResults)
                    .then(function (values) {
                    values.forEach(function (value, i) {
                        if (isBreak(value)) {
                            throw new Error("Cannot break in an accumulator object");
                        }
                        results[keys_1[i]] = value;
                    });
                    return nextFn ? resolve(iterablePromiseFn(nextFn)) : resolve();
                })
                    .catch(reject);
            }
            if (isChainPromiseFunc(fn)) {
                var result = fn(results, funcOps);
                if (isBreak(result)) {
                    return resolve(result.breakValue);
                }
                return nextFn ? resolve(iterablePromiseFn(nextFn)) : resolve(result);
            }
            reject("Values must either be an object or a function");
        });
    };
    return iterablePromiseFn(promiseFuncs[index]);
};
//# sourceMappingURL=chain.js.map