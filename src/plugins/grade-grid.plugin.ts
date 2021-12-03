import { PucrsClient } from "../client"
import parseGradeGrid, { GradeGrid } from "../parsers/grade-grid.parser";

declare module '../client' {
  export interface PucrsClient {
    gradeGrid(this: PucrsClient): Promise<GradeGrid|null>;
  }
}

PucrsClient.prototype.gradeGrid = async function (this: PucrsClient) {
  let menuActionResult = await this.executeMenuAction('Graus Publicados');
  if (menuActionResult.success && menuActionResult.data) {
    let hoursGrade = await parseGradeGrid(menuActionResult.data);
    return hoursGrade;
  }
  return null;
}

export {}
