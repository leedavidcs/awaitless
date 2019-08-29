"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduce = function (items, reducerFn, initial) {
    if (items.length === 0) {
        if (initial !== undefined) {
            return Promise.resolve(initial);
        }
        return Promise.reject(new TypeError("Reduce called with an empty array, and no initial value"));
    }
    var acc = initial !== undefined ? initial : items[0];
    var index = initial !== undefined ? 0 : 1;
    var iterablePromiseFn = function (i) {
        return new Promise(function (resolve, reject) {
            var isOutOfItems = index++ >= items.length;
            if (isOutOfItems) {
                return resolve(acc);
            }
            return reducerFn(acc, items[i], i)
                .then(function (result) {
                acc = result;
                resolve(iterablePromiseFn(index));
            })
                .catch(reject);
        });
    };
    return iterablePromiseFn(index);
};
//# sourceMappingURL=reduce.js.map