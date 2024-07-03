import { IPaymentDetails } from "../../model/payment.details.js";
import CheckOutPage from "./checkout.js";
//import confirmOrderForm from "./confirm.order.form.js";

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

    public async addPaymentDetails(paymentDetails: IPaymentDetails) : Promise<void> {
        await this.enterValue(this.inpCreditCardNumber, paymentDetails.cardnumber);
        await this.selectOption(this.selectCreditCardType, paymentDetails.cardtype);
        await this.enterValue(this.inpCreditCardName, paymentDetails.cardname);
        await this.enterValue(this.inpCreditCardExpiry, paymentDetails.expirydate);        
        await this.enterValue(this.inpCreditCardCVV, paymentDetails.cvv);
    }

    public async clickNext(): Promise<any> {
        await super.clickNext();
        await this.waitForActiveTabToBe("Confirm Order");
        //return confirmOrderForm;
    }
}

export default new PaymentDetailsTab();