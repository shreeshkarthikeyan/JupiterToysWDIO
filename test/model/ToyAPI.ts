import { LinkAPI } from "./LinkAPI.js";

export interface ToyAPI {
    id : number;
    price : number;
    category : string;
    title : string;
    size : string;
    image : string;
    stock : number;
    links : LinkAPI[];
}