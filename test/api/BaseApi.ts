import axios from "axios";
import { Agent } from "https";
import Token from "./Token.js";

const instance =  axios.create({
    headers : {
        Authorization : `Bearer ${await Token.getToken()}`,
        Accept : "application/json"
    },
    httpsAgent : new Agent({  
        rejectUnauthorized: false
    })
})

export default class BaseApi {

    public async postOperation(url: string, data : any) : Promise<string> {
        let response = await instance.post(url, data)
        .then(response => response.data)
        .catch(err => console.log(err));

        console.log("Post response:" + JSON.stringify(response));
        return JSON.stringify(response);
    }

    public async deleteOperation(url: string) : Promise<string> {
        let response = await instance.delete(url)
        .then(response => response.data)
        .catch(err => console.log(err));

        console.log("Delete response:" + JSON.stringify(response));
        return JSON.stringify(response);
    }

    public async patchOperation<T>(url: string, data : any) : Promise<T> {
        let response : Promise<T> = await instance.patch(url, data)
        .then(response => response.data)
        .catch(err => console.log(err));

        return response;
    }

    public async putOperation(url: string, data : any) {
        let response = await instance.put(url, data)
        .then(response => response.data)
        .catch(err => console.log(err));

        console.log("Put response:" + JSON.stringify(response));
        return JSON.stringify(response);
    }

    public async getAllOperation<T>(url: string) : Promise<T[]> {

        let data : Promise<T[]> = await instance.get(url)
        .then(response => response.data)
        .catch(err => console.log(err));

        return data;
    }
}
