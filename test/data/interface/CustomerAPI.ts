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

export const customerApi : CustomerAPI = {
    id: 0,
    username: "Shreeshthikeyan30@gmail.com",
    firstname: "Shreesh",
    lastname: "Karthikeyan",
    gender: "Male",
    phoneNumber: "0456314971",
    addresses: [],
    transactionHistory: [],
}
