import { expect } from '@wdio/globals'
import { toyAPIHandler, userAPIHandler } from '../api/index.js'
import { confirmOrderTab, deliveryDetailsTab, paymentDetailsTab } from '../pageobjects/CheckOut/index.js'
import { contactDetails, deliveryDetails, paymentDetails } from '../data/index.js'
import { cartPage, shopPage, homePage } from '../pageobjects/index.js'
import { addressApi, toyApi, linkApi, customerApi, transactionHistoryAPI, transactionItemAPI } from '../data/interface/index.js'

let linkAPI : linkApi = {
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

let toyAPI : toyApi = {
    id: 0,
    price: 25.99,
    category: "Small",
    title: "Dolphin",
    size: "Small",
    image: "https://www.pinterest.com.au/pin/766456430336669307/",
    stock: 30,
    links: [linkAPI]
}

let toy2API : toyApi = {
    id: 0,
    price: 18.99,
    category: "Small",
    title: "Mouse",
    size: "Medium",
    image: "https://www.pinterest.com.au/pin/766456430336669307/",
    stock: 30,
    links: [linkAPI]
}

let customerAPI : customerApi = {
    id: 0,
    username: "Shreeshthikeyan30@gmail.com",
    firstname: "Shreesh",
    lastname: "Karthikeyan",
    gender: "Male",
    phoneNumber: "0456314971",
    addresses: [],
    transactionHistory: [],
}

interface ToyToPurchaseWithQuantity {
    toy : toyApi,
    quantity : number
}

const toyListToPurchaseWithQuantity : ToyToPurchaseWithQuantity[] = [{
    toy: toyAPI,
    quantity: 2
}, {
    toy : toy2API,
    quantity: 3
}];



describe('Jupiter Toys API and UI testing', () => {

    it('Scenario 1 - Verify create and view toy THROUGH API', async () => {

        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            //Create toy:
            let toyId = await toyAPIHandler.createToy(purchasingToy.toy);
            console.log(toyId);

            purchasingToy.toy.id = Number(toyId);
            //Get toy:
            let toyDetails = await toyAPIHandler.getToyById(purchasingToy.toy.id.toString());
            if(toyDetails === undefined)
                throw new Error("No such toy created");
        
            await expect(toyDetails.id).toBe(purchasingToy.toy.id);
            await expect(toyDetails.price).toBe(purchasingToy.toy.price);
            await expect(toyDetails.category).toBe(purchasingToy.toy.category);
            await expect(toyDetails.title).toBe(purchasingToy.toy.title);
            await expect(toyDetails.size).toBe(purchasingToy.toy.size);
            await expect(toyDetails.image).toBe(purchasingToy.toy.image);
        };
    }),

    it('Scenario 2 - Different contact address and delivery address THROUGH UI', async () => {
        //test data:
        const contactDetail = new contactDetails("Shreesh", "Karthikeyan", "shreeshkarthikeyan30@gmail.com",
            Number(61456314971), "2, Coppin Close", "", "Hampton Park", "VIC", Number(3976)
        );

        const deliveryDetail = new deliveryDetails("Student Housing Accomodation",
            "Unit 201, 2 Eastern Place", "", "Hawthorn East", "VIC", Number(3123)
        );

        const paymentDetail = new paymentDetails(Number(1234123412341234),
            "Mastercard", "Shreesh Karthikeyan", "12/26", Number(123)
        );
        
        await homePage.clickShop();
        for (var i in toyListToPurchaseWithQuantity) {
            console.log("Toy's name: " + toyListToPurchaseWithQuantity[i].toy.title + " , Quantity: "+ toyListToPurchaseWithQuantity[i].quantity);
            await shopPage.addToy(toyListToPurchaseWithQuantity[i].toy.title, toyListToPurchaseWithQuantity[i].quantity);
            let toyPrice: number = await shopPage.getToyPrice(toyListToPurchaseWithQuantity[i].toy.title);
            console.log("Toy Price: " + toyPrice);
            await expect(Number(toyPrice)).toBe(Number(toyListToPurchaseWithQuantity[i].toy.price));
        }

        let totalPrice = toyListToPurchaseWithQuantity.reduce((accumulator, current) => accumulator + (current.toy.price === undefined ? Number(0) : Number(current.toy.price)) * current.quantity, 0);
        await shopPage.clickCart();

        for (var i in toyListToPurchaseWithQuantity) {
            let toySubTotal : number = (toyListToPurchaseWithQuantity[i].toy.price === undefined ? Number(0) : Number(toyListToPurchaseWithQuantity[i].toy.price)) * toyListToPurchaseWithQuantity[i].quantity;
            await expect(await cartPage.getToyQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await cartPage.getToySubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        await expect(await cartPage.getTotalPrice()).toContain(totalPrice.toString());
        let contactDetailsTab = await cartPage.clickCheckout();

        await contactDetailsTab.addContactDetails(contactDetail);
        await contactDetailsTab.clickNext();

        await deliveryDetailsTab.addDeliveryDetails(deliveryDetail);
        await deliveryDetailsTab.clickNext();
        
        await paymentDetailsTab.addPaymentDetails(paymentDetail);
        await paymentDetailsTab.clickNext();

        await confirmOrderTab.clickExpandAll();
        
        // Order Details section validation
        await expect(await confirmOrderTab.getNumberOfCartItems()).toBe(toyListToPurchaseWithQuantity.length);
        for (var i in toyListToPurchaseWithQuantity) {
            let toySubTotal : number = (toyListToPurchaseWithQuantity[i].toy.price === undefined ? Number(0) : Number(toyListToPurchaseWithQuantity[i].toy.price)) * toyListToPurchaseWithQuantity[i].quantity;
            await expect(await confirmOrderTab.getCartItemUnitPrice(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toyListToPurchaseWithQuantity[i].toy.price.toString());
            await expect(await confirmOrderTab.getCartItemQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await confirmOrderTab.getCartItemSubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        // Delivery & Contact Details section validation
        // Validating Contact Details
        await expect(await confirmOrderTab.getContactName()).toBe(contactDetail.firstname + " " + contactDetail.lastname);
        await expect(await confirmOrderTab.getContactEmailAddress()).toBe(contactDetail.email);
        await expect((await confirmOrderTab.getContactNumber())).toContain(contactDetail.phoneNumber.toString());
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.addressline1);
        if(contactDetail.addressline2.length > 0)
            await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.addressline2);
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.suburb);
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.state);
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.postcode.toString());

        // Validating Delivery Details
        await expect(await confirmOrderTab.getDeliveryName()).toBe(deliveryDetail.name);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(deliveryDetail.addressline1);
        if(deliveryDetail.addressline2.length > 0)
            await expect(await confirmOrderTab.getDeliveryAddress()).toContain(deliveryDetail.addressline2);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(deliveryDetail.suburb);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(deliveryDetail.state);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(deliveryDetail.postcode.toString());

        // Payment Details section validation
        await expect(await confirmOrderTab.getCardName()).toBe(paymentDetail.cardname);
        await expect(await confirmOrderTab.getCardNumber()).toBe(paymentDetail.cardnumber.toString());
        await expect(await confirmOrderTab.getCardType()).toBe(paymentDetail.cardtype);
        await expect(await confirmOrderTab.getCardExpiry()).toBe(paymentDetail.expirydate);
        await expect(await confirmOrderTab.getCardCVV()).toBe(paymentDetail.cvv.toString());
        
        let orderOutcomePage = await confirmOrderTab.clickSubmitOrder();

        console.log("Payment Status => " + await orderOutcomePage.getPaymentStatus());
        console.log("Order Number => " + await orderOutcomePage.getPaymentStatus());

    }),

    it('Scenario 3 - Same contact address and delivery address THROUGH UI', async () => {

        //test data:
        const contactDetail = new contactDetails("Shreesh", "Karthikeyan", "shreeshkarthikeyan30@gmail.com",
            Number(61456314971), "2, Coppin Close", "", "Hampton Park", "VIC", Number(3976)
        );

        const paymentDetail = new paymentDetails(Number(1234123412341234),
            "Mastercard", "Shreesh Karthikeyan", "12/26", Number(123)
        );

        homePage.clickShop();

        for (var i in toyListToPurchaseWithQuantity) {
            console.log("Toy's name: " + toyListToPurchaseWithQuantity[i].toy.title + " , Quantity: "+ toyListToPurchaseWithQuantity[i].quantity);
            await shopPage.addToy(toyListToPurchaseWithQuantity[i].toy.title, toyListToPurchaseWithQuantity[i].quantity);
            let toyPrice: number = await shopPage.getToyPrice(toyListToPurchaseWithQuantity[i].toy.title);
            console.log("Toy Price: " + toyPrice);
            await expect(Number(toyPrice)).toBe(Number(toyListToPurchaseWithQuantity[i].toy.price));
        }

        let totalPrice = toyListToPurchaseWithQuantity.reduce((accumulator, current) => accumulator + (current.toy.price === undefined ? Number(0) : Number(current.toy.price)) * current.quantity, 0);
        await shopPage.clickCart();

        for (var i in toyListToPurchaseWithQuantity) {
            let toySubTotal : number = (toyListToPurchaseWithQuantity[i].toy.price === undefined ? Number(0) : Number(toyListToPurchaseWithQuantity[i].toy.price)) * toyListToPurchaseWithQuantity[i].quantity;
            await expect(await cartPage.getToyQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await cartPage.getToySubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        await expect(await cartPage.getTotalPrice()).toContain(totalPrice.toString());
        let contactDetailsTab = await cartPage.clickCheckout();

        await contactDetailsTab.addContactDetails(contactDetail);
        await contactDetailsTab.clickNext();

        await deliveryDetailsTab.selectSameAsContactAddress();
        await deliveryDetailsTab.clickNext();
        
        await paymentDetailsTab.addPaymentDetails(paymentDetail);
        await paymentDetailsTab.clickNext();

        await confirmOrderTab.clickExpandAll();
        
        // Order Details section validation
        await expect(await confirmOrderTab.getNumberOfCartItems()).toBe(toyListToPurchaseWithQuantity.length);
        for (var i in toyListToPurchaseWithQuantity) {
            let toySubTotal : number = (toyListToPurchaseWithQuantity[i].toy.price === undefined ? Number(0) : Number(toyListToPurchaseWithQuantity[i].toy.price)) * toyListToPurchaseWithQuantity[i].quantity;
            await expect(await confirmOrderTab.getCartItemUnitPrice(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toyListToPurchaseWithQuantity[i].toy.price.toString());
            await expect(await confirmOrderTab.getCartItemQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await confirmOrderTab.getCartItemSubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        // Delivery & Contact Details section validation
        // Validating Contact Details
        await expect(await confirmOrderTab.getContactName()).toBe(contactDetail.firstname + " " + contactDetail.lastname);
        await expect(await confirmOrderTab.getContactEmailAddress()).toBe(contactDetail.email);
        await expect((await confirmOrderTab.getContactNumber())).toContain(contactDetail.phoneNumber.toString());
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.addressline1);
        if(contactDetail.addressline2.length > 0)
            await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.addressline2);
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.suburb);
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.state);
        await expect(await confirmOrderTab.getContactAddress()).toContain(contactDetail.postcode.toString());

        // Validating Delivery Details
        await expect(await confirmOrderTab.getDeliveryName()).toBe(contactDetail.firstname + " " + contactDetail.lastname);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(contactDetail.addressline1);
        if(contactDetail.addressline2.length > 0)
            await expect(await confirmOrderTab.getDeliveryAddress()).toContain(contactDetail.addressline2);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(contactDetail.suburb);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(contactDetail.state);
        await expect(await confirmOrderTab.getDeliveryAddress()).toContain(contactDetail.postcode.toString());
        

        // Payment Details section validation
        await expect(await confirmOrderTab.getCardName()).toBe(paymentDetail.cardname);
        await expect(await confirmOrderTab.getCardNumber()).toBe(paymentDetail.cardnumber.toString());
        await expect(await confirmOrderTab.getCardType()).toBe(paymentDetail.cardtype);
        await expect(await confirmOrderTab.getCardExpiry()).toBe(paymentDetail.expirydate);
        await expect(await confirmOrderTab.getCardCVV()).toBe(paymentDetail.cvv.toString());
        
        let orderOutcomePage = await confirmOrderTab.clickSubmitOrder();

        console.log("Payment Status => " + await orderOutcomePage.getPaymentStatus());
        console.log("Order Number => " + await orderOutcomePage.getOrderNumber());
    }),

    it('Scenario 4 - Verify purchasing a toy from a new customer account THROUGH API', async () => {
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

        //Create customer:
        let customerId = await userAPIHandler.createCustomer(customerAPI);
        console.log(customerId);

        customerAPI.id = Number(customerId);
        customerAPI.addresses = [addressApi]
        //Update customer address:
        let customerDetails = await userAPIHandler.updateCustomerAddress(customerId, customerAPI);
        await expect(customerDetails.id).toBe(customerAPI.id);
        await expect(customerDetails.username).toBe(customerAPI.username);
        await expect(customerDetails.firstname).toBe(customerAPI.firstname);
        await expect(customerDetails.lastname).toBe(customerAPI.lastname);
        await expect(customerDetails.gender).toBe(customerAPI.gender);
        await expect(customerDetails.phoneNumber).toBe(customerAPI.phoneNumber);
        await expect(customerDetails.addresses.at(0)?.line1).toBe(customerAPI.addresses.at(0)?.line1);
        await expect(customerDetails.addresses.at(0)?.line2).toBe(customerAPI.addresses.at(0)?.line2);
        await expect(customerDetails.addresses.at(0)?.city).toBe(customerAPI.addresses.at(0)?.city);
        await expect(customerDetails.addresses.at(0)?.postcode).toBe(customerAPI.addresses.at(0)?.postcode);
        await expect(customerDetails.addresses.at(0)?.state).toBe(customerAPI.addresses.at(0)?.state);
        await expect(customerDetails.addresses.at(0)?.addresstype).toBe(customerAPI.addresses.at(0)?.addresstype);
        await expect(customerDetails.addresses.at(0)?.deliveryName).toBe(customerAPI.addresses.at(0)?.deliveryName);


        let transactionItemsList : transactionItemAPI[] = []

        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            let transactionItem : transactionItemAPI = {
                id: 0,
                toy: await toyAPIHandler.getToyById(purchasingToy.toy.id.toString()),
                numberOfToys: purchasingToy.quantity,
                status: "OK"
            }
            transactionItemsList.push(transactionItem);
        };
        console.log(transactionItemsList);

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
        customerAPI.transactionHistory = [transactionHistory];
        
    }),

    it('Scenario 5 - Verify deleting customer and toy THROUGH API', async () => {

        //Delete customer:
        let deleteCustomerResponse = await userAPIHandler.deleteCustomer(customerAPI.id.toString());
        await expect(deleteCustomerResponse).toBe(true);
        //Updates the toy's stock to zero:
        let updateToyStockData = {
            "stock" : 0
        }
        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            let updatedToy = await toyAPIHandler.updateToyStock(purchasingToy.toy.id.toString(), updateToyStockData);   
            await expect(updatedToy).toBe(updateToyStockData.stock);
        }
        //Deletes the toy:
        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            let deleteToyResponseMessage = await toyAPIHandler.deleteToy(purchasingToy.toy.id.toString());
            await expect(deleteToyResponseMessage).toBe(`Toy with id ${purchasingToy.toy.id} deleted successfully`);
        }
    })

});

