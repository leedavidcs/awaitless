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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_OPTIONS = {
    concurrency: 1
};
exports.filter = function (items, filterFn, options) {
    var concurrency = __assign(__assign({}, DEFAULT_OPTIONS), options).concurrency;
    if (items.length === 0) {
        return Promise.resolve([]);
    }
    var results = [];
    var trueConcurrencyLimit = Math.min(items.length, concurrency);
    var index;
    var iterablePromiseFn = function (item, i) {
        return new Promise(function (resolve, reject) {
            filterFn(item, i).then(function (result) {
                results[i] = [result, item];
                var isOutOfItems = index++ >= items.length - 1;
                return isOutOfItems ? resolve() : resolve(iterablePromiseFn(items[index], index));
            });
        });
    };
    var rateLimitedProcessor = Array(trueConcurrencyLimit)
        .fill(null)
        .map(function (__, i) {
        index = i;
        return iterablePromiseFn(items[i], i);
    });
    return Promise.all(rateLimitedProcessor).then(function () {
        return results.filter(function (_a) {
            var _b = __read(_a, 1), shouldFilter = _b[0];
            return shouldFilter;
        }).map(function (_a) {
            var _b = __read(_a, 2), item = _b[1];
            return item;
        });
    });
};
//# sourceMappingURL=filter.js.map