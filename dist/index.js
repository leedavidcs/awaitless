"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var chain_1 = require("./chain");
var forEach_1 = require("./forEach");
var map_1 = require("./map");
var toPromise_1 = require("./toPromise");
__export(require("./chain"));
__export(require("./forEach"));
__export(require("./map"));
__export(require("./toPromise"));
var awaitless = Object.assign(chain_1.chain.bind({}), {
    forEach: forEach_1.forEach,
    map: map_1.map,
    toPromise: toPromise_1.toPromise
});
exports.default = awaitless;
//# sourceMappingURL=index.js.map