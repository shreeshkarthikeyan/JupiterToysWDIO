import { toyApi } from "./index.js";

export default interface TransactionItemAPI {
    id : number;
    toy : toyApi;
    numberOfToys : number;
    status : string;
}