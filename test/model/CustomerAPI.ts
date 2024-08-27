import { AddressAPI } from "./AddressAPI.js";
import { TransactionHistoryAPI } from "./TransactionHistoryAPI.js";

export interface CustomerAPI {
    id : number;
    username : string;
    firstname : string;
    lastname : string;
    gender : string;
    phoneNumber : string;
    addresses : AddressAPI[];
    transactionHistory : TransactionHistoryAPI[];
}