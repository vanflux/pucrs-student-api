import { Bill } from "../parsers/bill.parser";
declare module '../client' {
    interface PucrsClient {
        bill(this: PucrsClient): Promise<Bill | null>;
    }
}
export {};
