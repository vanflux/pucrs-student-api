"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PucrsClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "PucrsClient", { enumerable: true, get: function () { return client_1.PucrsClient; } });
// Load client plugins
require("./plugins/hours-grid.plugin");
require("./plugins/grade-grid.plugin");
require("./plugins/bill.plugin");
// Export parser types
__exportStar(require("./parsers/bill.parser"), exports);
__exportStar(require("./parsers/grade-grid.parser"), exports);
__exportStar(require("./parsers/hours-grid.parser"), exports);
