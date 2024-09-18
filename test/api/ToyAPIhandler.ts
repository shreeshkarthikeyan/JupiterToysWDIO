import { ToyAPI } from "../data/interface/index.js";
import BaseApi from "./BaseApi.js";

const URL = process.env.baseUrl!;

class ToyAPIHandler extends BaseApi {

    public async createToy(toyApi : ToyAPI) : Promise<string> {
        let response = await this.requests.post(URL, toyApi);

        response = JSON.stringify(response);
        let parsedResponse = JSON.parse(response);
        return parsedResponse.id;
    }

    public async deleteToy(toyId : string) : Promise<string> {
        let response = await this.requests.delete(`${URL}/${toyId}`);

        response = JSON.stringify(response);
        let parsedResponse = JSON.parse(response);
        console.log("Delete response:" + parsedResponse.message);
        return parsedResponse.message;
    }

    public async updateToyStock(toyId : string, data : any) : Promise<number | undefined> {
        let response = await this.requests.patch<ToyAPI>(`${URL}/${toyId}`, data);

        console.log("Stock count: "+response?.stock);
        return response?.stock;
    }

    public async getToyById(toyId : string) : Promise<ToyAPI> {
        let response = await this.requests.getAll<ToyAPI[]>(URL);

        if(!(response !== null && typeof response === 'object')) {
            throw new Error("Error in response");
        }

        let toyDetails = response.filter(toyApi => toyApi.id === Number(toyId)).at(0);
        if(toyDetails === undefined)
            throw new Error("No such toy is present");

        return toyDetails;
    }

    public async getToyByName(toyName : string) : Promise<any> {
        let response = await this.requests.getAll<ToyAPI[]>(URL);

        if(!(response !== null && typeof response === 'object')) {
            throw new Error("Error in response");
        }

        let toyDetails = response.filter(toyApi => toyApi.title === toyName).at(0);
        if(toyDetails === undefined)
            throw new Error("No such toy is present");

        return toyDetails;
    }
}

export default new ToyAPIHandler();