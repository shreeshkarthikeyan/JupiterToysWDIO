import { TransactionItemAPI } from "./TransactionItemAPI.js";

export interface TransactionHistoryAPI {
    id : number;
    transactionItems : TransactionItemAPI[];
    date : string;
    cost : number;
    paymentStatus : string;
    orderNumber : string;
}