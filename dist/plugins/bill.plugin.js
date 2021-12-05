"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../client");
const bill_parser_1 = __importDefault(require("../parsers/bill.parser"));
client_1.PucrsClient.prototype.bill = async function () {
    let menuActionResult = await this.executeMenuAction('2a. Via (Docs)');
    if (menuActionResult.success && menuActionResult.data) {
        let bill = await (0, bill_parser_1.default)(menuActionResult.data);
        return bill;
    }
    return null;
};
