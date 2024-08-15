import { PaymentDetails } from "../../data/payment.details.js";
import CheckOutPage from "./CheckoutPage.js";

class PaymentDetailsTab extends CheckOutPage {

    constructor() {
        super();
    }
    
    public get inputCreditCardNumber() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardno']");
    }

    public get selectCreditCardType() {
        return this.activeTabContainer.$(".//mat-select[@ng-reflect-name='creditcardtype']");
    }

    public get inputCreditCardName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardname']");
    }

    public get inputCreditCardExpiry() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardexpiry']");
    }

    public get inputCreditCardCVV() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='creditcardcvv']");
    }

    public async addPaymentDetails(paymentDetails: PaymentDetails) : Promise<void> {
        await this.waitForActiveTabToBe("Payment Details");
        await this.enterValue(this.inputCreditCardNumber, paymentDetails.cardnumber);
        await this.selectOption(this.selectCreditCardType, paymentDetails.cardtype);
        await this.enterValue(this.inputCreditCardName, paymentDetails.cardname);
        await this.enterValue(this.inputCreditCardExpiry, paymentDetails.expirydate);        
        await this.enterValue(this.inputCreditCardCVV, paymentDetails.cvv);
    }

    public async clickNext() {
        await super.clickNext();
    }
}

export default new PaymentDetailsTab();