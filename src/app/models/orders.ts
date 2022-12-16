import { iItem } from "./items";

export interface iOrders{
    id: number,
    orderId: number,
    dateCreated: string,
    convertedPrice: string,
    officeAddress: string,
    outputTimeInterval: string,
    selected?: number,
    item:iItem
}