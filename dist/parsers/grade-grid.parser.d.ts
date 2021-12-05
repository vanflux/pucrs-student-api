export interface GradeGrid {
    disciplineGrades?: DisciplineGrade[];
}
export interface DisciplineGrade {
    disciplineCode: string;
    disciplineName: string;
    partialGrade?: {
        [name: string]: number | null;
    };
    classCount?: number;
    absences?: number;
    finalGrade?: number;
    finalGradeMessage?: string;
    publishDate?: Date;
}
export default function parseGradeGrid(body: string): Promise<GradeGrid>;
