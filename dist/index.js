"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PucrsClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "PucrsClient", { enumerable: true, get: function () { return client_1.PucrsClient; } });
require("./plugins/hours-grid.plugin");
require("./plugins/grade-grid.plugin");
require("./plugins/bill.plugin");