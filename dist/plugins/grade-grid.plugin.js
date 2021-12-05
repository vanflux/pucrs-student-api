"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../client");
const grade_grid_parser_1 = __importDefault(require("../parsers/grade-grid.parser"));
client_1.PucrsClient.prototype.gradeGrid = async function () {
    let menuActionResult = await this.executeMenuAction('Graus Publicados');
    if (menuActionResult.success && menuActionResult.data) {
        let hoursGrade = await (0, grade_grid_parser_1.default)(menuActionResult.data);
        return hoursGrade;
    }
    return null;
};
