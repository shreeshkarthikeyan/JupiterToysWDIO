import { PaymentDetails } from "../../data/payment.details.js";
import CheckOutPage from "./CheckoutPage.js";
import confirmOrderForm from "./ConfirmOrderTab.js";

class PaymentDetailsTab extends CheckOutPage {

    constructor() {
        super();
    }
    
    public get inpCreditCardNumber() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardno']");
    }

    public get selectCreditCardType() {
        return this.activeTabContainer.$(".//mat-select[@ng-reflect-name='creditcardtype']");
    }

    public get inpCreditCardName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardname']");
    }

    public get inpCreditCardExpiry() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardexpiry']");
    }

    public get inpCreditCardCVV() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardcvv']");
    }

    public async addPaymentDetails(paymentDetails: PaymentDetails) : Promise<void> {
        await this.waitForActiveTabToBe("Payment Details");
        await this.enterValue(this.inpCreditCardNumber, paymentDetails.cardnumber);
        await this.selectOption(this.selectCreditCardType, paymentDetails.cardtype);
        await this.enterValue(this.inpCreditCardName, paymentDetails.cardname);
        await this.enterValue(this.inpCreditCardExpiry, paymentDetails.expirydate);        
        await this.enterValue(this.inpCreditCardCVV, paymentDetails.cvv);
    }

    public async clickNext() {
        await super.clickNext();
    }
}

export default new PaymentDetailsTab();