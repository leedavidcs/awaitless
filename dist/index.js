"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var chain_1 = require("./chain");
var doWhilst_1 = require("./doWhilst");
var forEach_1 = require("./forEach");
var map_1 = require("./map");
var reduce_1 = require("./reduce");
var toPromise_1 = require("./toPromise");
var whilst_1 = require("./whilst");
__export(require("./chain"));
__export(require("./doWhilst"));
__export(require("./forEach"));
__export(require("./map"));
__export(require("./reduce"));
__export(require("./toPromise"));
__export(require("./whilst"));
var awaitless = Object.assign(chain_1.chain.bind({}), {
    chain: chain_1.chain,
    doWhilst: doWhilst_1.doWhilst,
    forEach: forEach_1.forEach,
    map: map_1.map,
    reduce: reduce_1.reduce,
    toPromise: toPromise_1.toPromise,
    whilst: whilst_1.whilst
});
exports.default = awaitless;
//# sourceMappingURL=index.js.map