import { ToyAPI } from "../model/toyAPI.js";
import BaseApi from "./BaseApi.js";

const URL = "http://ec2-54-206-101-9.ap-southeast-2.compute.amazonaws.com:7081/toy";

class ToyAPIHandler extends BaseApi {

    public async createToy(toyApi : ToyAPI) : Promise<string> {
        let response = await this.postOperation(URL, toyApi);
        let parsedResponse = JSON.parse(response);
        return parsedResponse.id;
    }

    public async deleteToy(toyId : string) : Promise<string> {
        let response = await this.deleteOperation(`${URL}/${toyId}`)
        let parsedResponse = JSON.parse(response);
        console.log("Delete response:" + parsedResponse.message);
        return parsedResponse.message;
    }

    public async updateToyStock(toyId : string, data : any) : Promise<number> {
        let response : ToyAPI = await this.patchOperation<ToyAPI>(`${URL}/${toyId}`, data);
        console.log("Stock count: "+response.stock);
        return response.stock;
    }

    public async getToyById(toyId : string) : Promise<any> {
        let response : ToyAPI[] = await this.getAllOperation<ToyAPI>(URL);
        return response.filter(toyApi => toyApi.id === Number(toyId)).at(0);
    }

    public async getToyByName(toyName : string) : Promise<any> {
        let response : ToyAPI[] = await this.getAllOperation<ToyAPI>(URL);
        return response.filter(toyApi => toyApi.title === toyName).at(0);
    }
}

export default new ToyAPIHandler();