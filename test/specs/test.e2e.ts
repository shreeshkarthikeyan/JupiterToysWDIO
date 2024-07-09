import { expect } from '@wdio/globals'
import shop from '../pageobjects/ShopPage.js'
import CartItems from '../data/CartItems.js'
import cart from '../pageobjects/CartPage.js'
import { ContactDetails } from '../data/contact.details.js'
import { DeliveryDetails } from '../data/delivery.details.js'
import { PaymentDetails } from '../data/payment.details.js'

describe('Jupiter Toys Web Application', () => {
    it('Different contact address and delivery address', async () => {
        //test data:
        const contactDetails = new ContactDetails("Shreesh", "Karthikeyan", "shreeshkarthikeyan30@gmail.com",
            Number(61456314971), "2, Coppin Close", "", "Hampton Park", "VIC", Number(3976)
        );

        const deliveryDetails = new DeliveryDetails(false, "Student Housing Accomodation",
            "Unit 201, 2 Eastern Place", "", "Hawthorn East", "VIC", Number(3123)
        );

        const paymentDetails = new PaymentDetails(Number(1234123412341234),
            "Mastercard", "Shreesh Karthikeyan", "12/26", Number(123)
        );


        await shop.navigateToUrl();
        
        let shopObj = await shop.clickShop();
    
        //toy purchasing:
        await shopObj.addToy("Rubik's Cube", 2);
        let toyPrice: number = await shopObj.getToyPrice("Rubik's Cube");
        let toySubTotal : number = toyPrice * 2;
        let totalPrice : number = toySubTotal;
        
        await shopObj.clickCart();

        await expect(await cart.getToyQuantity("Rubik's Cube")).toBe(Number(2).toString());
        await expect(await cart.getToyPrice("Rubik's Cube")).toContain(toySubTotal.toString());
        await expect(await cart.getTotalPrice()).toContain(totalPrice.toString());
        
        let contactDetailsFormObj = await cart.clickCheckout();

        await contactDetailsFormObj.addContactDetails(contactDetails);
        let deliveryDetailsFormObj = await contactDetailsFormObj.clickNext();

        await deliveryDetailsFormObj.addDeliveryDetails(deliveryDetails);
        let paymentDetailsFormObj = await deliveryDetailsFormObj.clickNext();
        
        await paymentDetailsFormObj.addPaymentDetails(paymentDetails);
        let confirmOrderFormObj = await paymentDetailsFormObj.clickNext();

        await confirmOrderFormObj.clickExpandAll();
        
        // Order Details section validation
        await expect(await confirmOrderFormObj.getNumberOfCartItems()).toBe(Number(1));
        await expect(await confirmOrderFormObj.getCartItemUnitPrice("Rubik's Cube")).toContain(toyPrice.toString());
        await expect(await confirmOrderFormObj.getCartItemQuantity("Rubik's Cube")).toBe(Number(2).toString());
        await expect(await confirmOrderFormObj.getCartItemSubTotal("Rubik's Cube")).toContain(toySubTotal.toString());

        // Delivery & Contact Details section validation
        // Validating Contact Details
        await expect(await confirmOrderFormObj.getCName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
        await expect(await confirmOrderFormObj.getCEmailAddress()).toBe(contactDetails.email);
        await expect((await confirmOrderFormObj.getCNumber())).toContain(contactDetails.phoneNumber.toString());
        await expect(await confirmOrderFormObj.getCAddress()).toContain(contactDetails.addressline1);
        if(contactDetails.addressline2.length > 0)
            await expect(await confirmOrderFormObj.getCAddress()).toContain(contactDetails.addressline2);
        await expect(await confirmOrderFormObj.getCAddress()).toContain(contactDetails.suburb);
        await expect(await confirmOrderFormObj.getCAddress()).toContain(contactDetails.state);
        await expect(await confirmOrderFormObj.getCAddress()).toContain(contactDetails.postcode.toString());

        // Validating Delivery Details
        if(deliveryDetails.isSameAsContactAddress){
            await expect(await confirmOrderFormObj.getDName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(contactDetails.addressline1);
            if(contactDetails.addressline2.length > 0)
                await expect(await confirmOrderFormObj.getDAddress()).toContain(contactDetails.addressline2);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(contactDetails.suburb);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(contactDetails.state);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(contactDetails.postcode.toString());
        } else {
            await expect(await confirmOrderFormObj.getDName()).toBe(deliveryDetails.name);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(deliveryDetails.addressline1);
            if(contactDetails.addressline2.length > 0)
                await expect(await confirmOrderFormObj.getDAddress()).toContain(deliveryDetails.addressline2);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(deliveryDetails.suburb);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(deliveryDetails.state);
            await expect(await confirmOrderFormObj.getDAddress()).toContain(deliveryDetails.postcode.toString());
        }

        // Payment Details section validation
        await expect(await confirmOrderFormObj.getCardName()).toBe(paymentDetails.cardname);
        await expect(await confirmOrderFormObj.getCardNumber()).toBe(paymentDetails.cardnumber.toString());
        await expect(await confirmOrderFormObj.getCardType()).toBe(paymentDetails.cardtype);
        await expect(await confirmOrderFormObj.getCardExpiry()).toBe(paymentDetails.expirydate);
        await expect(await confirmOrderFormObj.getCardCVV()).toBe(paymentDetails.cvv.toString());
        
        let resultsObj = await confirmOrderFormObj.clickSubmitOrder();

        console.log("Payment Status => " + await resultsObj.getPaymentStatus());
        console.log("Order Number => " + await resultsObj.getPaymentStatus());

    })
/*    
    it('Same contact address and delivery address', async () => {
        //test data:
        //cart items:
        const productListToPurchase : Map<string, number> = new Map<string, number>(
                [
                    //["test_toy", 3],
                    ["Rubik's Cube", 2]
                ]
            );

        const contactDetails : IContactDetails = {
            firstname : "Shreesh",
            lastname : "Karthikeyan",
            email : "shreeshkarthikeyan30@gmail.com",
            phoneNumber : "0456314971",
            addressline1 : "2, Coppin Close",
            addressline2 : "",
            suburb : "Hampton Park",
            state : "VIC",
            postcode : "3976"
        };

        const deliveryDetails : IDeliveryDetails = {
            isSameAsContactAddress : true,
            name : "",
            addressline1 : "",
            addressline2 : "",
            suburb : "",
            state : "",
            postcode : ""
        }

        const paymentDetails : IPaymentDetails = {
            cardnumber : "1234123412341234",
            cardtype : "Mastercard",
            cardname : "Shreesh Karthikeyan",
            expirydate : "12/26",
            cvv : "123"
        }

        await commonNavigators.navigateToUrl();
        
        await commonNavigators.clickShop();
        
        for (let entry of productListToPurchase.entries()) {
            console.log(entry[0], entry[1]);
            await shop.addToy(entry[0], entry[1]);
            let toyPrice: number = await shop.getToyPrice(entry[0]);
            console.log(entry[0] + "'s price ===> "+ toyPrice);

            await CartItems.addToyInCartList(entry[0], entry[1], toyPrice);
        }
        
        await commonNavigators.clickCart();

        for (let entry of productListToPurchase.entries()) {
            await expect(await cart.getToyQuantity(entry[0])).toBe(CartItems.cartItems.get(entry[0])?.quantity.toString());
            await expect(await cart.getToyPrice(entry[0])).toContain(CartItems.getToySubTotal(entry[0].toString()));
        }
        await expect(await cart.getTotalPrice()).toContain(CartItems.getTotalPrice().toString());
        await cart.clickCheckout();
        
        await ContactDetailsForm.addContactDetails(contactDetails);
        await ContactDetailsForm.clickNext();

        await deliveryDetailsForm.addDeliveryDetails(deliveryDetails);
        await deliveryDetailsForm.clickNext();
        
        await paymentDetailsForm.addPaymentDetails(paymentDetails);
        await paymentDetailsForm.clickNext();

        await confirmOrderForm.clickExpandAll();
        
        // Order Details section validation
        await expect(await confirmOrderForm.getNumberOfCartItems()).toBe(CartItems.cartItems.size);
        for (let entry of productListToPurchase.entries()) {
            await expect(await confirmOrderForm.getCartItemUnitPrice(entry[0])).toContain(CartItems.cartItems.get(entry[0])?.price.toString());
            await expect(await confirmOrderForm.getCartItemQuantity(entry[0])).toBe(CartItems.cartItems.get(entry[0])?.quantity.toString());
            await expect(await confirmOrderForm.getCartItemSubTotal(entry[0])).toContain(CartItems.getToySubTotal(entry[0]).toString());
        }

        // Delivery & Contact Details section validation
        // Validating Contact Details
        await expect(await confirmOrderForm.getCName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
        await expect(await confirmOrderForm.getCEmailAddress()).toBe(contactDetails.email);
        await expect((await confirmOrderForm.getCNumber())).toContain(contactDetails.phoneNumber);
        if(contactDetails.addressline2.length > 0)
            await expect(await confirmOrderForm.getCAddress()).toContain(contactDetails.addressline2);
        await expect(await confirmOrderForm.getCAddress()).toContain(contactDetails.suburb);
        await expect(await confirmOrderForm.getCAddress()).toContain(contactDetails.state);
        await expect(await confirmOrderForm.getCAddress()).toContain(contactDetails.postcode);

        // Validating Delivery Details
        if(deliveryDetails.isSameAsContactAddress){
            await expect(await confirmOrderForm.getDName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
            await expect(await confirmOrderForm.getDAddress()).toContain(contactDetails.addressline1);
            if(contactDetails.addressline2.length > 0)
                await expect(await confirmOrderForm.getDAddress()).toContain(contactDetails.addressline2);
            await expect(await confirmOrderForm.getDAddress()).toContain(contactDetails.suburb);
            await expect(await confirmOrderForm.getDAddress()).toContain(contactDetails.state);
            await expect(await confirmOrderForm.getDAddress()).toContain(contactDetails.postcode);
        } else {
            await expect(await confirmOrderForm.getDName()).toBe(deliveryDetails.name);
            await expect(await confirmOrderForm.getDAddress()).toContain(deliveryDetails.addressline1);
            if(contactDetails.addressline2.length > 0)
                await expect(await confirmOrderForm.getDAddress()).toContain(deliveryDetails.addressline2);
            await expect(await confirmOrderForm.getDAddress()).toContain(deliveryDetails.suburb);
            await expect(await confirmOrderForm.getDAddress()).toContain(deliveryDetails.state);
            await expect(await confirmOrderForm.getDAddress()).toContain(deliveryDetails.postcode);
        }

        // Payment Details section validation
        await expect(await confirmOrderForm.getCardName()).toBe(paymentDetails.cardname);
        await expect(await confirmOrderForm.getCardNumber()).toBe(paymentDetails.cardnumber);
        await expect(await confirmOrderForm.getCardType()).toBe(paymentDetails.cardtype);
        await expect(await confirmOrderForm.getCardExpiry()).toBe(paymentDetails.expirydate);
        await expect(await confirmOrderForm.getCardCVV()).toBe(paymentDetails.cvv);

        await confirmOrderForm.clickSubmitOrder();

        console.log("Payment Status => " + await results.getPaymentStatus());
        console.log("Order Number => " + await results.getPaymentStatus());
    })
*/
})

