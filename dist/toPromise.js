"use strict";
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPromise = function (fn, thisArg) {
    var length = fn.length, name = fn.name;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            var promisifiedFnArgsLength = length - 1;
            if (args.length !== promisifiedFnArgsLength) {
                return reject("Function " + name + " as promise requires " + promisifiedFnArgsLength + " arguments. " +
                    ("Received " + args.length));
            }
            fn.bind(thisArg).apply(void 0, __spread(args, [function (err, result) { return (err ? reject(err) : resolve(result)); }]));
        });
    };
};
//# sourceMappingURL=toPromise.js.map