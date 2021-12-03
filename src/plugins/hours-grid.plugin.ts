import { PucrsClient } from "../client"
import parseHoursGrid, { HoursGrid } from "../parsers/hours-grid.parser";

declare module '../client' {
  export interface PucrsClient {
    hoursGrid(this: PucrsClient): Promise<HoursGrid|null>;
  }
}

PucrsClient.prototype.hoursGrid = async function (this: PucrsClient) {
  let menuActionResult = await this.executeMenuAction('Grade de Horários');
  if (menuActionResult.success && menuActionResult.data) {
    let hoursGrade = await parseHoursGrid(menuActionResult.data);
    return hoursGrade;
  }
  return null;
}

export {}
