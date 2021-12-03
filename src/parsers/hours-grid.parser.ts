import parse, { HTMLElement } from "node-html-parser";

export interface HoursGrid {
  year?: number,
  semester?: number,
  allDays?: string[],
  allPeriods?: Period[],
  hours?: HourCell[],
  disciplines?: Discipline[],
}

export interface HourCell {
  periods: Period[],
  day: string,
  disciplineCode: string,
  additional: string,
}

export interface Period {
  name: string,
  start?: string,
  end?: string,
}

export interface Discipline {
  code: string,
  name?: string,
}

function yearSemester(root: HTMLElement) {
  let titleYearSem = root.querySelector('h1 > br')?.nextSibling?.textContent;
  if (!titleYearSem) return {};
  let titleYearSemMatcher = titleYearSem.match(/(\d+)\/(\d+)/);
  if (!titleYearSemMatcher) return {};
  return { year: parseInt(titleYearSemMatcher[1]), semester: parseInt(titleYearSemMatcher[2]) };
}

function gradeCells(root: HTMLElement) {
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
    let period: Period = { name, start, end };
    return period;
  });

  let hours: HourCell[] = [];

  contentRows.forEach((contentRow, row) => {
    let [_, __, ...cellElems] = contentRow.querySelectorAll('td');
    cellElems.forEach((cellElem, column) => {
      // Size of cell (height)
      let rowSpan = parseInt(cellElem.attributes.rowspan);
      if (isNaN(rowSpan)) rowSpan = 1;

      // Get periods and days
      let periods = allPeriods.slice(row, row+rowSpan);
      let day = allDays[column];

      // Code and addition (building number, room...)
      let disciplineCode = cellElem.querySelector('b')?.text;
      let additional = cellElem.text.substring(disciplineCode?.length??0);
      if (!disciplineCode || !additional) return;

      let cell: HourCell = { periods, day, disciplineCode, additional };
      hours.push(cell);
    });
  });

  return { hours };
}

function disciplines(root: HTMLElement) {
  let rows = root.querySelectorAll('table')[1]?.querySelectorAll('tbody > tr');
  let [_, ...contentRows] = rows;

  let disciplines: Discipline[] = [];

  contentRows.forEach(contentRow => {
    let cellElems = contentRow.querySelectorAll('td');
    let lastCode: string | null;
    cellElems.forEach(cellElem => {
      let widthAttr = parseInt(cellElem.attributes.width); // All cells that have width attr have discipline code
      if (isNaN(widthAttr)) {
        // Discipline name
        let name = cellElem.text.trim();
        if (lastCode == null) return;
        let discipline: Discipline = { code: lastCode, name };
        disciplines.push(discipline);
        lastCode = null;
      } else {
        // Discipline code
        lastCode = cellElem.text.trim();
      }
    });
  });

  return { disciplines };
}

export default async function parseHoursGrid(body: string): Promise<HoursGrid> {
  const root = parse(body);

  return {
    ...yearSemester(root),
    ...gradeCells(root),
    ...disciplines(root),
  };
}
