import { addressApi, transactionHistoryAPI } from "./index.js";

export default interface CustomerAPI {
    id : number;
    username : string;
    firstname : string;
    lastname : string;
    gender : string;
    phoneNumber : string;
    addresses : addressApi[];
    transactionHistory : transactionHistoryAPI[];
}