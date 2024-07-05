import { DeliveryDetails } from "../../model/delivery.details.js";
import CheckOutPage from "./checkout.js";
import paymentDetailsForm from "./payment.details.form.js";

class DeliveryDetailsTab extends CheckOutPage {

    
    constructor() {
        super();
    }
    public get isSameAsContactAddress() {
        return this.activeTabContainer.$(".//mat-radio-button[@value='Yes' and contains(@class,'mat-radio-button')]");
    }

    public get isNotSameAsContactAddress() {
        return this.activeTabContainer.$(".//mat-radio-button[@value='No' and contains(@class,'mat-radio-button')]");
    }

    public get inpName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='name']");
    }

    public get inpAddressLine1() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='addressline1']");
    }

    public get inpAddressLine2() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='addressline2']");
    }

    public get inpSuburb() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='suburb']");
    }

    public get selectState() {
        return this.activeTabContainer.$(".//mat-select[@ng-reflect-name='state']");
    }

    public get inpPostcode() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='postcode']");
    }

    public async addDeliveryDetails(deliveryDetails: DeliveryDetails) : Promise<void> {
        if(deliveryDetails.isSameAsContactAddress) {
            let classValue = await (await this.isSameAsContactAddress).getAttribute("class");
            if(!(classValue.includes("mat-radio-checked"))) {
                await this.click(this.isSameAsContactAddress);
            }
        }else {
            let classValue = await (await this.isNotSameAsContactAddress).getAttribute("class");
            if(!(classValue.includes("mat-radio-checked"))) {
                await this.click(this.isNotSameAsContactAddress);
            } 
            await this.enterValue(this.inpName, deliveryDetails.name);
            await this.enterValue(this.inpAddressLine1, deliveryDetails.addressline1);
            await this.enterValue(this.inpAddressLine2, deliveryDetails.addressline2);
            await this.enterValue(this.inpSuburb, deliveryDetails.suburb);
            await this.selectOption(this.selectState, deliveryDetails.state);
            await this.enterValue(this.inpPostcode, deliveryDetails.postcode);
        }
    }

    public async clickNext(): Promise<any> {
        await super.clickNext();
        await this.waitForActiveTabToBe("Payment Details");
        return paymentDetailsForm;
    }
}

export default new DeliveryDetailsTab();