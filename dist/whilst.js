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
    initialValue: null,
    maxRetry: Infinity
};
exports.whilst = function (condFn, fn, options) {
    var finalOptions = __assign({}, DEFAULT_OPTIONS, options);
    var result = Promise.resolve(finalOptions.initialValue);
    var retryCount = 0;
    var iterablePromiseFn = function () {
        return new Promise(function (resolve, reject) {
            Promise.resolve(result).then(function (current) {
                return Promise.resolve(condFn(current)).then(function (isOver) {
                    if (!isOver) {
                        return resolve(result);
                    }
                    if (retryCount >= finalOptions.maxRetry) {
                        reject(new Error("Reached maximum number of retries in whilst loop."));
                    }
                    result = Promise.resolve(fn(current));
                    retryCount++;
                    resolve(iterablePromiseFn());
                });
            });
        });
    };
    return iterablePromiseFn();
};
//# sourceMappingURL=whilst.js.map