import { linkApi } from "./index.js";

export default interface ToyAPI {
    id : number;
    price : number;
    category : string;
    title : string;
    size : string;
    image : string;
    stock : number;
    links : linkApi[];
}