"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../client");
const hours_grid_parser_1 = __importDefault(require("../parsers/hours-grid.parser"));
client_1.PucrsClient.prototype.hoursGrid = async function () {
    let menuActionResult = await this.executeMenuAction('Grade de Horários');
    if (menuActionResult.success && menuActionResult.data) {
        let hoursGrade = await (0, hours_grid_parser_1.default)(menuActionResult.data);
        return hoursGrade;
    }
    return null;
};
