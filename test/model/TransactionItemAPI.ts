import { ToyAPI } from "./toyAPI.js";

export interface TransactionItemAPI {
    id : number;
    toy : ToyAPI;
    numberOfToys : number;
    status : string;
}