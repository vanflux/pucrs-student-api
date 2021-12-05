import { GradeGrid } from "../parsers/grade-grid.parser";
declare module '../client' {
    interface PucrsClient {
        gradeGrid(this: PucrsClient): Promise<GradeGrid | null>;
    }
}
export {};
