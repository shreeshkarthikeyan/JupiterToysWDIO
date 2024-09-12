import { CustomerAPI } from "../data/interface/CustomerAPI.js";
import { TransactionHistoryAPI } from "../data/interface/TransactionHistoryAPI.js";
import BaseApi, { readEnvironmentVariables } from "./BaseApi.js";

const URL = readEnvironmentVariables().customerbaseurl!;

class UserAPIHandler extends BaseApi {

    public async createCustomer(customerApi : CustomerAPI) : Promise<string> {
        let response = await this.requests.post(`${URL}/customer`, customerApi);

        response = JSON.stringify(response);
        let parsedResponse = JSON.parse(response);
        return parsedResponse.id;
    }

    public async updateCustomerAddress(customerId: string, customerApi : CustomerAPI) : Promise<CustomerAPI> {
        let response = await this.requests.patch<CustomerAPI>(`${URL}/customer/${customerId}`, customerApi)
        
        if(!(response !== null && typeof response === 'object')) {
            throw new Error("Error in response");
        }
        console.log(response.addresses.at(0)?.id);
        return response;
    }

    public async addToysToCart(customerId: string, toysAddToCart : TransactionHistoryAPI) {
        let response = await this.requests.put(`${URL}/customer/${customerId}/purchase`, toysAddToCart)
        
        response = JSON.stringify(response);
        let parsedResponse = JSON.parse(response);
        return parsedResponse;
    }

    public async updatePurchaseStatus(transactionId: string, paymentStatusUpdate : any) : Promise<string> {
        let response = await this.requests.patch<string>(`${URL}/transaction/${transactionId}`, paymentStatusUpdate);

        response = JSON.stringify(response);
        let parsedResponse = JSON.parse(response);
        return parsedResponse.status;
    }

    public async deleteCustomer(customerId: string) {
        let response = await this.requests.delete(`${URL}/customer/${customerId}`);

        response = JSON.stringify(response);
        let parsedResponse = JSON.parse(response);
        return parsedResponse;
    }

}

export default new UserAPIHandler();