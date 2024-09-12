import { expect } from '@wdio/globals'
import toyAPIhandler from '../api/ToyAPIhandler.js'
import UserAPIhandler from '../api/UserAPIhandler.js'
import { ToyAPI } from '../data/interface/ToyAPI.js'
import { LinkAPI } from '../data/interface/LinkAPI.js'
import { CustomerAPI } from '../data/interface/CustomerAPI.js'
import { AddressAPI } from '../data/interface/AddressAPI.js'
import { TransactionItemAPI } from '../data/interface/TransactionItemAPI.js'
import { TransactionHistoryAPI } from '../data/interface/TransactionHistoryAPI.js'
import ConfirmOrderTab from '../pageobjects/CheckOut/ConfirmOrderTab.js'
import DeliveryDetailsTab from '../pageobjects/CheckOut/DeliveryDetailsTab.js'
import PaymentDetailsTab from '../pageobjects/CheckOut/PaymentDetailsTab.js'
import { ContactDetails } from '../data/contact.details.js'
import { DeliveryDetails } from '../data/delivery.details.js'
import { PaymentDetails } from '../data/payment.details.js'
import CartPage from '../pageobjects/CartPage.js'
import homePage from '../pageobjects/HomePage.js'
import shopPage from '../pageobjects/ShopPage.js'

let linkApi : LinkAPI = {
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

let toyApi : ToyAPI = {
    id: 0,
    price: 25.99,
    category: "Small",
    title: "Dolphin",
    size: "Small",
    image: "https://www.pinterest.com.au/pin/766456430336669307/",
    stock: 30,
    links: [linkApi]
}

let toy2Api : ToyAPI = {
    id: 0,
    price: 18.99,
    category: "Small",
    title: "Mouse",
    size: "Medium",
    image: "https://www.pinterest.com.au/pin/766456430336669307/",
    stock: 30,
    links: [linkApi]
}

let customerApi : CustomerAPI = {
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
    toy : ToyAPI,
    quantity : number
}

const toyListToPurchaseWithQuantity : ToyToPurchaseWithQuantity[] = [{
    toy: toyApi,
    quantity: 2
}, {
    toy : toy2Api,
    quantity: 3
}];



describe('Jupiter Toys API and UI testing', () => {

    it('Scenario 1 - Verify create and view toy THROUGH API', async () => {

        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            //Create toy:
            let toyId = await toyAPIhandler.createToy(purchasingToy.toy);
            console.log(toyId);

            purchasingToy.toy.id = Number(toyId);
            //Get toy:
            let toyDetails = await toyAPIhandler.getToyById(purchasingToy.toy.id.toString());
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
        const contactDetails = new ContactDetails("Shreesh", "Karthikeyan", "shreeshkarthikeyan30@gmail.com",
            Number(61456314971), "2, Coppin Close", "", "Hampton Park", "VIC", Number(3976)
        );

        const deliveryDetails = new DeliveryDetails("Student Housing Accomodation",
            "Unit 201, 2 Eastern Place", "", "Hawthorn East", "VIC", Number(3123)
        );

        const paymentDetails = new PaymentDetails(Number(1234123412341234),
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
            await expect(await CartPage.getToyQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await CartPage.getToySubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        await expect(await CartPage.getTotalPrice()).toContain(totalPrice.toString());
        let contactDetailsTab = await CartPage.clickCheckout();

        await contactDetailsTab.addContactDetails(contactDetails);
        await contactDetailsTab.clickNext();

        await DeliveryDetailsTab.addDeliveryDetails(deliveryDetails);
        await DeliveryDetailsTab.clickNext();
        
        await PaymentDetailsTab.addPaymentDetails(paymentDetails);
        await PaymentDetailsTab.clickNext();

        await ConfirmOrderTab.clickExpandAll();
        
        // Order Details section validation
        await expect(await ConfirmOrderTab.getNumberOfCartItems()).toBe(toyListToPurchaseWithQuantity.length);
        for (var i in toyListToPurchaseWithQuantity) {
            let toySubTotal : number = (toyListToPurchaseWithQuantity[i].toy.price === undefined ? Number(0) : Number(toyListToPurchaseWithQuantity[i].toy.price)) * toyListToPurchaseWithQuantity[i].quantity;
            await expect(await ConfirmOrderTab.getCartItemUnitPrice(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toyListToPurchaseWithQuantity[i].toy.price.toString());
            await expect(await ConfirmOrderTab.getCartItemQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await ConfirmOrderTab.getCartItemSubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        // Delivery & Contact Details section validation
        // Validating Contact Details
        await expect(await ConfirmOrderTab.getContactName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
        await expect(await ConfirmOrderTab.getContactEmailAddress()).toBe(contactDetails.email);
        await expect((await ConfirmOrderTab.getContactNumber())).toContain(contactDetails.phoneNumber.toString());
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.addressline1);
        if(contactDetails.addressline2.length > 0)
            await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.addressline2);
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.suburb);
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.state);
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.postcode.toString());

        // Validating Delivery Details
        await expect(await ConfirmOrderTab.getDeliveryName()).toBe(deliveryDetails.name);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(deliveryDetails.addressline1);
        if(deliveryDetails.addressline2.length > 0)
            await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(deliveryDetails.addressline2);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(deliveryDetails.suburb);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(deliveryDetails.state);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(deliveryDetails.postcode.toString());

        // Payment Details section validation
        await expect(await ConfirmOrderTab.getCardName()).toBe(paymentDetails.cardname);
        await expect(await ConfirmOrderTab.getCardNumber()).toBe(paymentDetails.cardnumber.toString());
        await expect(await ConfirmOrderTab.getCardType()).toBe(paymentDetails.cardtype);
        await expect(await ConfirmOrderTab.getCardExpiry()).toBe(paymentDetails.expirydate);
        await expect(await ConfirmOrderTab.getCardCVV()).toBe(paymentDetails.cvv.toString());
        
        let orderOutcomePage = await ConfirmOrderTab.clickSubmitOrder();

        console.log("Payment Status => " + await orderOutcomePage.getPaymentStatus());
        console.log("Order Number => " + await orderOutcomePage.getPaymentStatus());

    })

    it('Scenario 3 - Same contact address and delivery address THROUGH UI', async () => {

        //test data:
        const contactDetails = new ContactDetails("Shreesh", "Karthikeyan", "shreeshkarthikeyan30@gmail.com",
            Number(61456314971), "2, Coppin Close", "", "Hampton Park", "VIC", Number(3976)
        );

        const paymentDetails = new PaymentDetails(Number(1234123412341234),
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
            await expect(await CartPage.getToyQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await CartPage.getToySubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        await expect(await CartPage.getTotalPrice()).toContain(totalPrice.toString());
        let contactDetailsTab = await CartPage.clickCheckout();

        await contactDetailsTab.addContactDetails(contactDetails);
        await contactDetailsTab.clickNext();

        await DeliveryDetailsTab.selectSameAsContactAddress();
        await DeliveryDetailsTab.clickNext();
        
        await PaymentDetailsTab.addPaymentDetails(paymentDetails);
        await PaymentDetailsTab.clickNext();

        await ConfirmOrderTab.clickExpandAll();
        
        // Order Details section validation
        await expect(await ConfirmOrderTab.getNumberOfCartItems()).toBe(toyListToPurchaseWithQuantity.length);
        for (var i in toyListToPurchaseWithQuantity) {
            let toySubTotal : number = (toyListToPurchaseWithQuantity[i].toy.price === undefined ? Number(0) : Number(toyListToPurchaseWithQuantity[i].toy.price)) * toyListToPurchaseWithQuantity[i].quantity;
            await expect(await ConfirmOrderTab.getCartItemUnitPrice(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toyListToPurchaseWithQuantity[i].toy.price.toString());
            await expect(await ConfirmOrderTab.getCartItemQuantity(toyListToPurchaseWithQuantity[i].toy.title)).toBe(toyListToPurchaseWithQuantity[i].quantity.toString());
            await expect(await ConfirmOrderTab.getCartItemSubTotal(toyListToPurchaseWithQuantity[i].toy.title)).toContain(toySubTotal.toString());
        }

        // Delivery & Contact Details section validation
        // Validating Contact Details
        await expect(await ConfirmOrderTab.getContactName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
        await expect(await ConfirmOrderTab.getContactEmailAddress()).toBe(contactDetails.email);
        await expect((await ConfirmOrderTab.getContactNumber())).toContain(contactDetails.phoneNumber.toString());
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.addressline1);
        if(contactDetails.addressline2.length > 0)
            await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.addressline2);
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.suburb);
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.state);
        await expect(await ConfirmOrderTab.getContactAddress()).toContain(contactDetails.postcode.toString());

        // Validating Delivery Details
        await expect(await ConfirmOrderTab.getDeliveryName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(contactDetails.addressline1);
        if(contactDetails.addressline2.length > 0)
            await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(contactDetails.addressline2);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(contactDetails.suburb);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(contactDetails.state);
        await expect(await ConfirmOrderTab.getDeliveryAddress()).toContain(contactDetails.postcode.toString());
        

        // Payment Details section validation
        await expect(await ConfirmOrderTab.getCardName()).toBe(paymentDetails.cardname);
        await expect(await ConfirmOrderTab.getCardNumber()).toBe(paymentDetails.cardnumber.toString());
        await expect(await ConfirmOrderTab.getCardType()).toBe(paymentDetails.cardtype);
        await expect(await ConfirmOrderTab.getCardExpiry()).toBe(paymentDetails.expirydate);
        await expect(await ConfirmOrderTab.getCardCVV()).toBe(paymentDetails.cvv.toString());
        
        let orderOutcomePage = await ConfirmOrderTab.clickSubmitOrder();

        console.log("Payment Status => " + await orderOutcomePage.getPaymentStatus());
        console.log("Order Number => " + await orderOutcomePage.getOrderNumber());
    }),

    it('Scenario 4 - Verify purchasing a toy from a new customer account THROUGH API', async () => {
        //test data:
        let addressApi : AddressAPI = {
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
        let customerId = await UserAPIhandler.createCustomer(customerApi);
        console.log(customerId);

        customerApi.id = Number(customerId);
        customerApi.addresses = [addressApi]
        //Update customer address:
        let customerDetails = await UserAPIhandler.updateCustomerAddress(customerId, customerApi);
        await expect(customerDetails.id).toBe(customerApi.id);
        await expect(customerDetails.username).toBe(customerApi.username);
        await expect(customerDetails.firstname).toBe(customerApi.firstname);
        await expect(customerDetails.lastname).toBe(customerApi.lastname);
        await expect(customerDetails.gender).toBe(customerApi.gender);
        await expect(customerDetails.phoneNumber).toBe(customerApi.phoneNumber);
        await expect(customerDetails.addresses.at(0)?.line1).toBe(customerApi.addresses.at(0)?.line1);
        await expect(customerDetails.addresses.at(0)?.line2).toBe(customerApi.addresses.at(0)?.line2);
        await expect(customerDetails.addresses.at(0)?.city).toBe(customerApi.addresses.at(0)?.city);
        await expect(customerDetails.addresses.at(0)?.postcode).toBe(customerApi.addresses.at(0)?.postcode);
        await expect(customerDetails.addresses.at(0)?.state).toBe(customerApi.addresses.at(0)?.state);
        await expect(customerDetails.addresses.at(0)?.addresstype).toBe(customerApi.addresses.at(0)?.addresstype);
        await expect(customerDetails.addresses.at(0)?.deliveryName).toBe(customerApi.addresses.at(0)?.deliveryName);


        let transactionItemsList : TransactionItemAPI[] = []

        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            let transactionItem : TransactionItemAPI = {
                id: 0,
                toy: await toyAPIhandler.getToyById(purchasingToy.toy.id.toString()),
                numberOfToys: purchasingToy.quantity,
                status: "OK"
            }
            transactionItemsList.push(transactionItem);
        };
        console.log(transactionItemsList);

        let transactionHistory : TransactionHistoryAPI = {
            id: 0,
            transactionItems: transactionItemsList,
            date: new Date().toLocaleDateString(),
            cost: transactionItemsList.reduce((accumulator, current) => accumulator + (current.toy.price === undefined ? Number(0) : Number(current.toy.price)) * current.numberOfToys, 0),
            paymentStatus: "",
            orderNumber: ""
        }

        //Add purchase to customer account:
        let response = await UserAPIhandler.addToysToCart(customerId, transactionHistory);
        console.log("Transaction ID: "+response.transaction_id);
        console.log("Order Number: "+response.order_number);

        transactionHistory.id = response.transaction_id;
        transactionHistory.orderNumber = response.order_number;
        //updates payment status
        let updatePaymentStatusData = {
            "paymentStatus" : "Successful",
        }
        let updatePurchaseStatusResponse = await UserAPIhandler.updatePurchaseStatus(transactionHistory.id.toString(), updatePaymentStatusData);
        await expect(updatePurchaseStatusResponse.trim()).toBe("transaction updated successfully");

        transactionHistory.paymentStatus = updatePaymentStatusData.paymentStatus;
        customerApi.transactionHistory = [transactionHistory];
        
    }),

    it('Scenario 5 - Verify deleting customer and toy THROUGH API', async () => {

        //Delete customer:
        let deleteCustomerResponse = await UserAPIhandler.deleteCustomer(customerApi.id.toString());
        await expect(deleteCustomerResponse).toBe(true);
        //Updates the toy's stock to zero:
        let updateToyStockData = {
            "stock" : 0
        }
        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            let updatedToy = await toyAPIhandler.updateToyStock(purchasingToy.toy.id.toString(), updateToyStockData);   
            await expect(updatedToy).toBe(updateToyStockData.stock);
        }
        //Deletes the toy:
        for (const purchasingToy of toyListToPurchaseWithQuantity) {
            let deleteToyResponseMessage = await toyAPIhandler.deleteToy(purchasingToy.toy.id.toString());
            await expect(deleteToyResponseMessage).toBe(`Toy with id ${purchasingToy.toy.id} deleted successfully`);
        }
    })

});

