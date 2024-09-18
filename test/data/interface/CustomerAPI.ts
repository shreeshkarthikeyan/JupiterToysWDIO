import { AddressAPI , TransactionHistoryAPI } from "./index.js"

export default interface CustomerAPI {
    id : number;
    username : string;
    firstname : string;
    lastname : string;
    gender : string;
    phoneNumber : string;
    addresses : AddressAPI[];
    transactionHistory : TransactionHistoryAPI[];
}