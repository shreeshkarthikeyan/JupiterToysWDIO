import { expect } from '@wdio/globals'
import { toyAPIHandler, userAPIHandler } from '../api/index.js'
import { addressApi, toyApi, linkApi, customerApi, transactionHistoryAPI, transactionItemAPI } from '../data/interface/index.js'

let toyId : string;
let customerId : string;

describe('Jupiter Toys API testing', () => {

    it('Scenario 1 - Verify create and view toy', async () => {
        //test data:
        let linkApi : linkApi = {
            rel: "",
            href: "",
            hreflang: "",
            media: "",
            title: "",
            type: "",
            deprecation: "",
            profile: "",
            name: ""
        }
    
        let toyApi : toyApi = {
            id: 0,
            price: 25.99,
            category: "Small",
            title: "Dolphin",
            size: "Small",
            image: "https://www.pinterest.com.au/pin/766456430336669307/",
            stock: 30,
            links: [linkApi]
        }

        //Create toy:
        toyId = await toyAPIHandler.createToy(toyApi);
        console.log(toyId);

        toyApi.id = Number(toyId);
        //Get toy:
        let toyDetails = await toyAPIHandler.getToyById(toyId);
        if(toyDetails === undefined)
            throw new Error("No such toy created");
      
        await expect(toyDetails.id).toBe(toyApi.id);
        await expect(toyDetails.price).toBe(toyApi.price);
        await expect(toyDetails.category).toBe(toyApi.category);
        await expect(toyDetails.title).toBe(toyApi.title);
        await expect(toyDetails.size).toBe(toyApi.size);
        await expect(toyDetails.image).toBe(toyApi.image);
    }),

    it('Scenario 2 - Verify purchasing a toy from a new customer account', async () => {
        //test data:
        let addressApi : addressApi = {
            id: 0,
            line1: "2, Coppin Close",
            line2: "",
            city: "Hampton Park",
            postcode: "3976",
            state: "VIC",
            addresstype: "Postal",
            deliveryName: "Shreesh"
        }

        let customerApi : customerApi = {
            id: 0,
            username: "Shreeshthikeyan30@gmail.com",
            firstname: "Shreesh",
            lastname: "Karthikeyan",
            gender: "Male",
            phoneNumber: "0456314971",
            addresses: [],
            transactionHistory: [],
        }

        //Create customer:
        customerId = await userAPIHandler.createCustomer(customerApi);
        console.log(customerId);

        customerApi.id = Number(customerId);
        customerApi.addresses = [addressApi]
        //Update customer address:
        let customerDetails = await userAPIHandler.updateCustomerAddress(customerId, customerApi);
        await expect(customerDetails.id).toBe(customerApi.id);
        await expect(customerDetails.username).toBe(customerApi.username);
        await expect(customerDetails?.firstname).toBe(customerApi.firstname);
        await expect(customerDetails?.lastname).toBe(customerApi.lastname);
        await expect(customerDetails?.gender).toBe(customerApi.gender);
        await expect(customerDetails?.phoneNumber).toBe(customerApi.phoneNumber);
        await expect(customerDetails?.addresses.at(0)?.line1).toBe(customerApi.addresses.at(0)?.line1);
        await expect(customerDetails?.addresses.at(0)?.line2).toBe(customerApi.addresses.at(0)?.line2);
        await expect(customerDetails?.addresses.at(0)?.city).toBe(customerApi.addresses.at(0)?.city);
        await expect(customerDetails?.addresses.at(0)?.postcode).toBe(customerApi.addresses.at(0)?.postcode);
        await expect(customerDetails?.addresses.at(0)?.state).toBe(customerApi.addresses.at(0)?.state);
        await expect(customerDetails?.addresses.at(0)?.addresstype).toBe(customerApi.addresses.at(0)?.addresstype);
        await expect(customerDetails?.addresses.at(0)?.deliveryName).toBe(customerApi.addresses.at(0)?.deliveryName);


        let transactionItemsList : transactionItemAPI[] = [
            {
                id: 0,
                toy: await toyAPIHandler.getToyById(toyId),
                numberOfToys: 3,
                status: "OK"
            }
        ]

        let transactionHistory : transactionHistoryAPI = {
            id: 0,
            transactionItems: transactionItemsList,
            date: new Date().toLocaleDateString(),
            cost: transactionItemsList.reduce((accumulator, current) => accumulator + (current.toy.price === undefined ? Number(0) : Number(current.toy.price)) * current.numberOfToys, 0),
            paymentStatus: "",
            orderNumber: ""
        }

        //Add purchase to customer account:
        let response = await userAPIHandler.addToysToCart(customerId, transactionHistory);
        console.log("Transaction ID: "+response.transaction_id);
        console.log("Order Number: "+response.order_number);

        transactionHistory.id = response.transaction_id;
        transactionHistory.orderNumber = response.order_number;
        //updates payment status
        let updatePaymentStatusData = {
            "paymentStatus" : "Successful",
        }
        let updatePurchaseStatusResponse = await userAPIHandler.updatePurchaseStatus(transactionHistory.id.toString(), updatePaymentStatusData);
        await expect(updatePurchaseStatusResponse.trim()).toBe("transaction updated successfully");

        transactionHistory.paymentStatus = updatePaymentStatusData.paymentStatus;
        customerApi.transactionHistory = [transactionHistory];
        
    }),

    it('Scenario 3 - Verify deleting customer and toy', async () => {

        //Delete customer:
        let deleteCustomerResponse = await userAPIHandler.deleteCustomer(customerId);
        await expect(deleteCustomerResponse).toBe(true);
        //Updates the toy's stock to zero:
        let updateToyStockData = {
            "stock" : 0
        }
        let updatedToy = await toyAPIHandler.updateToyStock(toyId, updateToyStockData);
        await expect(updatedToy).toBe(updateToyStockData.stock);        
        //Deletes the toy:
        let deleteToyResponseMessage = await toyAPIHandler.deleteToy(toyId);
        await expect(deleteToyResponseMessage).toBe(`Toy with id ${toyId} deleted successfully`);
    })

});

