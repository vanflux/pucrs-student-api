"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_html_parser_1 = __importDefault(require("node-html-parser"));
function yearSemester(root) {
    let titleYearSem = root.querySelector('h1 > br')?.nextSibling?.textContent;
    if (!titleYearSem)
        return {};
    let titleYearSemMatcher = titleYearSem.match(/(\d+)\/(\d+)/);
    if (!titleYearSemMatcher)
        return {};
    return { year: parseInt(titleYearSemMatcher[1]), semester: parseInt(titleYearSemMatcher[2]) };
}
function gradeCells(root) {
    let rows = root.querySelectorAll('table')[0]?.querySelectorAll('tbody > tr');
    let [headerRow, ...contentRows] = rows;
    let allDays = headerRow.querySelectorAll('td').map(x => x.text);
    allDays.shift();
    let allPeriods = contentRows.map(x => {
        let [nameElem, hourRangeElem] = x.querySelectorAll('td');
        let name = nameElem.text.replace('\n', ''); // J\n -> J
        let hourRangeArray = hourRangeElem.text.replace('\n', '').match(/(\d{1,2}:\d\d)/g); // 17:3018:15 -> [17:30, 18:15]
        let start = hourRangeArray?.at(0);
        let end = hourRangeArray?.at(1);
        let period = { name, start, end };
        return period;
    });
    let hours = [];
    contentRows.forEach((contentRow, row) => {
        let [_, __, ...cellElems] = contentRow.querySelectorAll('td');
        cellElems.forEach((cellElem, column) => {
            // Size of cell (height)
            let rowSpan = parseInt(cellElem.attributes.rowspan);
            if (isNaN(rowSpan))
                rowSpan = 1;
            // Get periods and days
            let periods = allPeriods.slice(row, row + rowSpan);
            let day = allDays[column];
            // Code and addition (building number, room...)
            let disciplineCode = cellElem.querySelector('b')?.text;
            let additional = cellElem.text.substring(disciplineCode?.length ?? 0);
            if (!disciplineCode || !additional)
                return;
            let cell = { periods, day, disciplineCode, additional };
            hours.push(cell);
        });
    });
    return { hours };
}
function disciplines(root) {
    let rows = root.querySelectorAll('table')[1]?.querySelectorAll('tbody > tr');
    let [_, ...contentRows] = rows;
    let disciplines = [];
    contentRows.forEach(contentRow => {
        let cellElems = contentRow.querySelectorAll('td');
        let lastCode;
        cellElems.forEach(cellElem => {
            let widthAttr = parseInt(cellElem.attributes.width); // All cells that have width attr have discipline code
            if (isNaN(widthAttr)) {
                // Discipline name
                let name = cellElem.text.trim();
                if (lastCode == null)
                    return;
                let discipline = { code: lastCode, name };
                disciplines.push(discipline);
                lastCode = null;
            }
            else {
                // Discipline code
                lastCode = cellElem.text.trim();
            }
        });
    });
    return { disciplines };
}
async function parseHoursGrid(body) {
    const root = (0, node_html_parser_1.default)(body);
    return {
        ...yearSemester(root),
        ...gradeCells(root),
        ...disciplines(root),
    };
}
exports.default = parseHoursGrid;
