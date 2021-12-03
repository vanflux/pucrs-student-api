import { PucrsClient } from "../client"
import parseBill, { Bill } from "../parsers/bill.parser";

declare module '../client' {
  export interface PucrsClient {
    bill(this: PucrsClient): Promise<Bill|null>;
  }
}

PucrsClient.prototype.bill = async function (this: PucrsClient) {
  let menuActionResult = await this.executeMenuAction('2a. Via (Docs)');
  if (menuActionResult.success && menuActionResult.data) {
    let bill = await parseBill(menuActionResult.data);
    return bill;
  }
  return null;
}

export {}
