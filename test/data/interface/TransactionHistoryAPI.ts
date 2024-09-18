import { transactionItemAPI } from "./index.js";

export default interface TransactionHistoryAPI {
    id : number;
    transactionItems : transactionItemAPI[];
    date : string;
    cost : number;
    paymentStatus : string;
    orderNumber : string;
}