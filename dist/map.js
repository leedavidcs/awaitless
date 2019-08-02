"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_OPTIONS = {
    concurrency: Infinity
};
exports.map = function (items, mapFn, options) {
    var concurrency = __assign({}, DEFAULT_OPTIONS, options).concurrency;
    if (items.length === 0) {
        return new Promise(function (resolve) { return resolve([]); });
    }
    var index = 0;
    var results = [];
    var trueConcurrencyLimit = Math.min(items.length, concurrency);
    var iterablePromiseFn = function (item) {
        return new Promise(function (resolve, reject) {
            return mapFn(item)
                .then(function (result) {
                results.push(result);
                var isOutOfItems = ++index === items.length;
                return isOutOfItems ? resolve() : resolve(iterablePromiseFn(items[index]));
            })
                .catch(reject);
        });
    };
    var rateLimitedProcessor = Array(trueConcurrencyLimit)
        .fill(null)
        .map(function () { return iterablePromiseFn(items[index++]); });
    return Promise.all(rateLimitedProcessor).then(function () { return results; });
};
//# sourceMappingURL=map.js.map