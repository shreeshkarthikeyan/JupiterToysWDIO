import { ToyAPI } from "./index.js";

export default interface TransactionItemAPI {
    id : number;
    toy : ToyAPI;
    numberOfToys : number;
    status : string;
}