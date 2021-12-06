import parse, { HTMLElement } from "node-html-parser";

export interface GradeGrid {
  disciplineGrades?: DisciplineGrade[];
}

export interface DisciplineGrade {
  disciplineCode: string;
  disciplineName: string;
  partialGrade?: {[name: string]: number|null};
  classCount?: number;
  absences?: number;
  finalGrade?: number;
  finalGradeMessage?: string;
  publishDate?: Date;
}

function disciplineGradeRows(rows: HTMLElement[]): DisciplineGrade {
  let [disciplineCodeCell, disciplineNameCell, partialGradesCell, classCountCell, absencesCell, gradesCell] = rows[0].querySelectorAll(':scope > td');
  let [publishCell] = rows[2].querySelectorAll('td');

  let disciplineCode = disciplineCodeCell.text.split('/')[0];
  let disciplineName = disciplineNameCell.text;

  let [partialGradesHeader, partialGradesContent] = partialGradesCell.querySelectorAll('tr');
  let partialGradeNames = partialGradesHeader.querySelectorAll('th').map(x => x.text.trim());
  let partialGradeContents = partialGradesContent.querySelectorAll('td').map(x => {
    let n = parseFloat(x.text);
    if (isNaN(n)) return null;
    return n;
  });
  let partialGrade = Object.fromEntries(partialGradeNames.map((name, i)=>[name, partialGradeContents[i]]));

  let classCount = parseInt(classCountCell.text);
  let absences = parseInt(absencesCell.text);
  let finalGradeText = gradesCell.text;
  let finalGrade: number|undefined = parseFloat(finalGradeText);
  if (isNaN(finalGrade)) finalGrade = undefined;
  let finalGradeMessage = finalGrade === undefined ? finalGradeText : undefined;
  let publishMatches = publishCell.text.match(/Ata publicada em: (\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/);
  let publishDate: Date|undefined;
  if (publishMatches && publishMatches.length >= 7) {
    publishDate = new Date(
      parseInt(publishMatches[3]), 
      parseInt(publishMatches[2])-1, 
      parseInt(publishMatches[1]), 
      parseInt(publishMatches[4]), 
      parseInt(publishMatches[5]), 
      parseInt(publishMatches[6])
    );
  }
  return { disciplineCode, disciplineName, partialGrade, classCount, absences, finalGradeMessage, finalGrade, publishDate };
}

function gradeGrid(root: HTMLElement): GradeGrid {
  let [_, ...rows] = root.querySelectorAll('table[class^=graus] > tbody > tr');
  let disciplineGrades: DisciplineGrade[] = [];
  for (let i = 0; i < rows.length; i+=3) {
    let subRows = rows.slice(i, i+3);
    if (subRows.length === 3) disciplineGrades.push(disciplineGradeRows(subRows));
  }
  return { disciplineGrades };
}

export default async function parseGradeGrid(body: string): Promise<GradeGrid> {
  const root = parse(body);
  return gradeGrid(root);
}
