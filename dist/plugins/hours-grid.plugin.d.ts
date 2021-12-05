import { HoursGrid } from "../parsers/hours-grid.parser";
declare module '../client' {
    interface PucrsClient {
        hoursGrid(this: PucrsClient): Promise<HoursGrid | null>;
    }
}
export {};
