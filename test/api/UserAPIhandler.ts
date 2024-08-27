import { CustomerAPI } from "../model/CustomerAPI.js";
import { TransactionHistoryAPI } from "../model/TransactionHistoryAPI.js";
import BaseApi from "./BaseApi.js";

const URL = "https://ec2-54-206-101-9.ap-southeast-2.compute.amazonaws.com:7083";

class UserAPIHandler extends BaseApi {

    public async createCustomer(customerApi : CustomerAPI) : Promise<string> {
        let response = await this.postOperation(`${URL}/customer`, customerApi);
        let parsedResponse = JSON.parse(response);
        return parsedResponse.id;
    }

    public async updateCustomerAddress(customerId: string, customerApi : CustomerAPI) : Promise<CustomerAPI> {
        let response : CustomerAPI = await this.patchOperation<CustomerAPI>(`${URL}/customer/${customerId}`, customerApi)
        console.log(response.addresses.at(0)?.id);
        return response;
    }

    public async addToysToCart(customerId: string, toysAddToCart : TransactionHistoryAPI) {
        let response = await this.putOperation(`${URL}/customer/${customerId}/purchase`, toysAddToCart)
        let parsedResponse = JSON.parse(response);
        return parsedResponse;
    }

    public async updatePurchaseStatus(transactionId: string, paymentStatusUpdate : any) : Promise<string> {
        let response = await this.patchOperation<string>(`${URL}/transaction/${transactionId}`, paymentStatusUpdate);

        response = JSON.stringify(response);
        let parsedResponse = JSON.parse(response);
        return parsedResponse.status;
    }

    public async deleteCustomer(customerId: string) {
        let response = await this.deleteOperation(`${URL}/customer/${customerId}`)
        let parsedResponse = JSON.parse(response);
        return parsedResponse;
    }

}

export default new UserAPIHandler();