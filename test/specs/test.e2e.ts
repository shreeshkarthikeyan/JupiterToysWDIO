import { expect } from '@wdio/globals'
import shop from '../pageobjects/ShopPage.js'
import CartPage from '../pageobjects/CartPage.js'
import { ContactDetails } from '../data/contact.details.js'
import { DeliveryDetails } from '../data/delivery.details.js'
import { PaymentDetails } from '../data/payment.details.js'
import { Toy } from '../data/toy.js'

describe('Jupiter Toys Web Application', () => {

    it('Different contact address and delivery address', async () => {

        const toy1 = new Toy("Rubik's Cube", 2);

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
        
        let shopPage = await shop.clickShop();
    
        //toy purchasing:
        await shopPage.addToy(toy1.toyName, toy1.quantity);
        let toyPrice: number = await shopPage.getToyPrice(toy1.toyName);
        toy1.price = toyPrice;
        let toySubTotal : number = toy1.price * toy1.quantity;
        let totalPrice : number = toySubTotal;
        
        await shopPage.clickCart();

        await expect(await CartPage.getToyQuantity(toy1.toyName)).toBe(Number(2).toString());
        await expect(await CartPage.getToySubTotal(toy1.toyName)).toContain(toySubTotal.toString());
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
        await expect(await confirmOrderTab.getCartItemUnitPrice(toy1.toyName)).toContain(toyPrice.toString());
        await expect(await confirmOrderTab.getCartItemQuantity(toy1.toyName)).toBe(Number(2).toString());
        await expect(await confirmOrderTab.getCartItemSubTotal(toy1.toyName)).toContain(toySubTotal.toString());

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

    }),

    it('Same contact address and delivery address', async () => {
        //test data:

        const toy1 = new Toy("Rubik's Cube", 2);

        const toy2 = new Toy("Peppa pig", 3);

        const toysList : Toy[] = [
            toy1,
            toy2
        ];

        //test data:
        const contactDetails = new ContactDetails("Shreesh", "Karthikeyan", "shreeshkarthikeyan30@gmail.com",
            Number(61456314971), "2, Coppin Close", "", "Hampton Park", "VIC", Number(3976)
        );

        const deliveryDetails = new DeliveryDetails(true, "",
            "", "", "", "", Number()
        );

        const paymentDetails = new PaymentDetails(Number(1234123412341234),
            "Mastercard", "Shreesh Karthikeyan", "12/26", Number(123)
        );

        let shopPage = await shop.clickShop();

        for (var i in toysList) {
            console.log("Toy's name: " + toysList[i].toyName + " , Quantity: "+toysList[i].quantity);
            await shopPage.addToy(toysList[i].toyName, toysList[i].quantity);
            let toyPrice: number = await shopPage.getToyPrice(toysList[i].toyName);
            toysList[i].price = toyPrice;
        }
        
        console.log(toysList);

        let totalPrice = toysList.reduce((accumulator, current) => accumulator + (current.price === undefined ? Number(0) : Number(current.price)) * current.quantity, 0);
        await shopPage.clickCart();

        for (var i in toysList) {
            let toySubTotal : number = (toysList[i].price === undefined ? Number(0) : Number(toysList[i].price)) * toysList[i].quantity;
            await expect(await CartPage.getToyQuantity(toysList[i].toyName)).toBe(toysList[i].quantity.toString());
            await expect(await CartPage.getToySubTotal(toysList[i].toyName)).toContain(toySubTotal.toString());
        }

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
        await expect(await confirmOrderTab.getNumberOfCartItems()).toBe(toysList.length);
        for (var i in toysList) {
            let toySubTotal : number = (toysList[i].price === undefined ? Number(0) : Number(toysList[i].price)) * toysList[i].quantity;
            await expect(await confirmOrderTab.getCartItemUnitPrice(toysList[i].toyName)).toContain(toysList[i].price?.toString());
            await expect(await confirmOrderTab.getCartItemQuantity(toysList[i].toyName)).toBe(toysList[i].quantity.toString());
            await expect(await confirmOrderTab.getCartItemSubTotal(toysList[i].toyName)).toContain(toySubTotal.toString());
        }

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
        console.log("Order Number => " + await resultsPage.getOrderNumber());
    })
});

