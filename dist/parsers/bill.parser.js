"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_html_parser_1 = __importDefault(require("node-html-parser"));
function bill(root) {
    let rows = root.querySelectorAll('table')[0]?.querySelectorAll('tbody > tr');
    let [_, contentRow, totalRow] = rows;
    let [yearCell, semesterCell, parcelsCell, documentNumberCell, expireDateCell, valueCell, emitBillCell] = contentRow.querySelectorAll('td');
    let year = parseInt(yearCell.text);
    let semester = parseInt(semesterCell.text);
    let parcels = parseInt(parcelsCell.text);
    let documentNumber = parseInt(documentNumberCell.text);
    let expireDateMatches = expireDateCell.text.match(/(\d+)\/(\d+)\/(\d+)/);
    let expireDate;
    if (expireDateMatches && expireDateMatches.length >= 4) {
        expireDate = new Date(parseInt(expireDateMatches[3]), parseInt(expireDateMatches[2]) - 1, parseInt(expireDateMatches[1]));
    }
    let value = parseFloat(valueCell.text.replace(',', ''));
    let [__, ___, totalValueCell] = totalRow.querySelectorAll('td');
    let totalValue = parseFloat(totalValueCell.text.replace(',', ''));
    let billOnclick = emitBillCell.querySelector('input')?.attributes['onclick'];
    let billUrl = billOnclick?.split('\'')[1];
    return { year, semester, parcels, documentNumber, expireDate, value, totalValue, billUrl };
}
async function parseBill(body) {
    const root = (0, node_html_parser_1.default)(body);
    return {
        ...bill(root),
    };
}
exports.default = parseBill;
