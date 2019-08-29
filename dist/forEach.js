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
    concurrency: 1
};
exports.forEach = function (items, forEachFn, options) {
    var concurrency = __assign(__assign({}, DEFAULT_OPTIONS), options).concurrency;
    if (items.length === 0) {
        return new Promise(function (resolve) { return resolve(); });
    }
    var trueConcurrencyLimit = Math.min(items.length, concurrency);
    var index;
    var iterablePromiseFn = function (item, i) {
        return new Promise(function (resolve, reject) {
            return forEachFn(item, i)
                .then(function () {
                var isOutOfItems = index++ >= items.length - 1;
                return isOutOfItems
                    ? resolve()
                    : resolve(iterablePromiseFn(items[index], index));
            })
                .catch(reject);
        });
    };
    var rateLimitedProcessor = Array(trueConcurrencyLimit)
        .fill(null)
        .map(function (__, i) {
        index = i;
        return iterablePromiseFn(items[i], i);
    });
    return Promise.all(rateLimitedProcessor).then();
};
//# sourceMappingURL=forEach.js.map