export interface HoursGrid {
    year?: number;
    semester?: number;
    allDays?: string[];
    allPeriods?: Period[];
    hours?: HourCell[];
    disciplines?: Discipline[];
}
export interface HourCell {
    periods: Period[];
    day: string;
    disciplineCode: string;
    additional: string;
}
export interface Period {
    name: string;
    start?: string;
    end?: string;
}
export interface Discipline {
    code: string;
    name?: string;
}
export default function parseHoursGrid(body: string): Promise<HoursGrid>;
