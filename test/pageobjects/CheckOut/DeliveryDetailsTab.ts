import { DeliveryDetails } from "../../data/delivery.details.js";
import CheckOutPage from "./CheckoutPage.js";
import paymentDetailsForm from "./PaymentDetailsTab.js";

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
        await this.waitForActiveTabToBe("Delivery Details");
        await this.click(this.isNotSameAsContactAddress);
        await this.enterValue(this.inpName, deliveryDetails.name);
        await this.enterValue(this.inpAddressLine1, deliveryDetails.addressline1);
        await this.enterValue(this.inpAddressLine2, deliveryDetails.addressline2);
        await this.enterValue(this.inpSuburb, deliveryDetails.suburb);
        await this.selectOption(this.selectState, deliveryDetails.state);
        await this.enterValue(this.inpPostcode, deliveryDetails.postcode);
    }

    public async selectSameAsContactAddress() {
        await this.waitForActiveTabToBe("Delivery Details");
        await this.click(this.isSameAsContactAddress);
    }

    public async clickNext() {
        await super.clickNext();
    }
}

export default new DeliveryDetailsTab();