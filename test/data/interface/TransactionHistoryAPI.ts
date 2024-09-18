import { TransactionItemAPI } from "./index.js";

export default interface TransactionHistoryAPI {
    id : number;
    transactionItems : TransactionItemAPI[];
    date : string;
    cost : number;
    paymentStatus : string;
    orderNumber : string;
}