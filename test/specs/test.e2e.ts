import { expect } from '@wdio/globals'
import shop from '../pageobjects/ShopPage.js'
import CartItems from '../data/CartItems.js'
import CartPage from '../pageobjects/CartPage.js'
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
        
        let shopPage = await shop.clickShop();
    
        //toy purchasing:
        await shopPage.addToy("Rubik's Cube", 2);
        let toyPrice: number = await shopPage.getToyPrice("Rubik's Cube");
        let toySubTotal : number = toyPrice * 2;
        let totalPrice : number = toySubTotal;
        
        await shopPage.clickCart();

        await expect(await CartPage.getToyQuantity("Rubik's Cube")).toBe(Number(2).toString());
        await expect(await CartPage.getToyPrice("Rubik's Cube")).toContain(toySubTotal.toString());
        await expect(await CartPage.getTotalPrice()).toContain(totalPrice.toString());
        
        let contactDetailsTab = await CartPage.clickCheckout();

        await contactDetailsTab.addContactDetails(contactDetails);
        let deliveryDetailsTab = await contactDetailsTab.clickNext();

        await deliveryDetailsTab.addDeliveryDetails(deliveryDetails);
        let paymentDetailsTab = await deliveryDetailsTab.clickNext();
        
        await paymentDetailsTab.addPaymentDetails(paymentDetails);
        let confirmOrderTab = await paymentDetailsTab.clickNext();

        await confirmOrderTab.clickExpandAll();
        
        // Order Details section validation
        await expect(await confirmOrderTab.getNumberOfCartItems()).toBe(Number(1));
        await expect(await confirmOrderTab.getCartItemUnitPrice("Rubik's Cube")).toContain(toyPrice.toString());
        await expect(await confirmOrderTab.getCartItemQuantity("Rubik's Cube")).toBe(Number(2).toString());
        await expect(await confirmOrderTab.getCartItemSubTotal("Rubik's Cube")).toContain(toySubTotal.toString());

        // Delivery & Contact Details section validation
        // Validating Contact Details
        await expect(await confirmOrderTab.getCName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
        await expect(await confirmOrderTab.getCEmailAddress()).toBe(contactDetails.email);
        await expect((await confirmOrderTab.getCNumber())).toContain(contactDetails.phoneNumber.toString());
        await expect(await confirmOrderTab.getCAddress()).toContain(contactDetails.addressline1);
        if(contactDetails.addressline2.length > 0)
            await expect(await confirmOrderTab.getCAddress()).toContain(contactDetails.addressline2);
        await expect(await confirmOrderTab.getCAddress()).toContain(contactDetails.suburb);
        await expect(await confirmOrderTab.getCAddress()).toContain(contactDetails.state);
        await expect(await confirmOrderTab.getCAddress()).toContain(contactDetails.postcode.toString());

        // Validating Delivery Details
        if(deliveryDetails.isSameAsContactAddress){
            await expect(await confirmOrderTab.getDName()).toBe(contactDetails.firstname + " " + contactDetails.lastname);
            await expect(await confirmOrderTab.getDAddress()).toContain(contactDetails.addressline1);
            if(contactDetails.addressline2.length > 0)
                await expect(await confirmOrderTab.getDAddress()).toContain(contactDetails.addressline2);
            await expect(await confirmOrderTab.getDAddress()).toContain(contactDetails.suburb);
            await expect(await confirmOrderTab.getDAddress()).toContain(contactDetails.state);
            await expect(await confirmOrderTab.getDAddress()).toContain(contactDetails.postcode.toString());
        } else {
            await expect(await confirmOrderTab.getDName()).toBe(deliveryDetails.name);
            await expect(await confirmOrderTab.getDAddress()).toContain(deliveryDetails.addressline1);
            if(contactDetails.addressline2.length > 0)
                await expect(await confirmOrderTab.getDAddress()).toContain(deliveryDetails.addressline2);
            await expect(await confirmOrderTab.getDAddress()).toContain(deliveryDetails.suburb);
            await expect(await confirmOrderTab.getDAddress()).toContain(deliveryDetails.state);
            await expect(await confirmOrderTab.getDAddress()).toContain(deliveryDetails.postcode.toString());
        }

        // Payment Details section validation
        await expect(await confirmOrderTab.getCardName()).toBe(paymentDetails.cardname);
        await expect(await confirmOrderTab.getCardNumber()).toBe(paymentDetails.cardnumber.toString());
        await expect(await confirmOrderTab.getCardType()).toBe(paymentDetails.cardtype);
        await expect(await confirmOrderTab.getCardExpiry()).toBe(paymentDetails.expirydate);
        await expect(await confirmOrderTab.getCardCVV()).toBe(paymentDetails.cvv.toString());
        
        let resultsPage = await confirmOrderTab.clickSubmitOrder();

        console.log("Payment Status => " + await resultsPage.getPaymentStatus());
        console.log("Order Number => " + await resultsPage.getPaymentStatus());

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

