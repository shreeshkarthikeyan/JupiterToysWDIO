import { ToyAPI } from "./ToyAPI.js";

export interface TransactionItemAPI {
    id : number;
    toy : ToyAPI;
    numberOfToys : number;
    status : string;
}