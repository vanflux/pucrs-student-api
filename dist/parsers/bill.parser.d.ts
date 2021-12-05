export interface Bill {
    year: number;
    semester: number;
    parcels: number;
    documentNumber: number;
    expireDate?: Date;
    value: number;
    totalValue: number;
    billUrl?: string;
}
export default function parseBill(body: string): Promise<Bill>;
