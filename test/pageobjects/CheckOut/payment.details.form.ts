import { IPaymentDetails } from "../../model/payment.details.js";
import CheckOutPage from "./checkout.js";

class PaymentDetailsTab extends CheckOutPage {

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

    public async addPaymentDetails(paymentDetails: IPaymentDetails) : Promise<void> {
        this.enterValue(this.inpCreditCardNumber, paymentDetails.cardnumber);
        this.selectOption(this.selectCreditCardType, paymentDetails.cardtype);
        this.enterValue(this.inpCreditCardName, paymentDetails.cardname);
        this.enterValue(this.inpCreditCardExpiry, paymentDetails.expirydate);        
        this.enterValue(this.inpCreditCardCVV, paymentDetails.cvv);
    }
}

export default new PaymentDetailsTab();