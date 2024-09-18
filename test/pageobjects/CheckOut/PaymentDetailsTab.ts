import { paymentDetails } from "../../data/index.js";
import { checkoutPage } from "./index.js";

class PaymentDetailsTab extends checkoutPage {

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

    public async addPaymentDetails(paymentDetails: paymentDetails) : Promise<void> {
        await this.waitForActiveTabToBe("Payment Details");
        await this.enterValue(this.inputCreditCardNumber, paymentDetails.cardnumber);
        await this.selectOption(this.selectCreditCardType, paymentDetails.cardtype);
        await this.enterValue(this.inputCreditCardName, paymentDetails.cardname);
        await this.enterValue(this.inputCreditCardExpiry, paymentDetails.expirydate);        
        await this.enterValue(this.inputCreditCardCVV, paymentDetails.cvv);
    }
}

export default new PaymentDetailsTab();