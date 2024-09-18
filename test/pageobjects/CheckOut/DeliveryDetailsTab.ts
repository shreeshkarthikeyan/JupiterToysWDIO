import { DeliveryDetails } from "../../data/index.js";
import CheckOutPage from "./CheckoutPage.js";

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

    public get inputName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='name']");
    }

    public get inputAddressLine1() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='addressline1']");
    }

    public get inputAddressLine2() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='addressline2']");
    }

    public get inputSuburb() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='suburb']");
    }

    public get selectState() {
        return this.activeTabContainer.$(".//mat-select[@ng-reflect-name='state']");
    }

    public get inputPostcode() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='postcode']");
    }

    public async addDeliveryDetails(deliveryDetails: DeliveryDetails) : Promise<void> {
        await this.waitForActiveTabToBe("Delivery Details");
        await this.click(this.isNotSameAsContactAddress);
        await this.enterValue(this.inputName, deliveryDetails.name);
        await this.enterValue(this.inputAddressLine1, deliveryDetails.addressline1);
        await this.enterValue(this.inputAddressLine2, deliveryDetails.addressline2);
        await this.enterValue(this.inputSuburb, deliveryDetails.suburb);
        await this.selectOption(this.selectState, deliveryDetails.state);
        await this.enterValue(this.inputPostcode, deliveryDetails.postcode);
    }

    public async selectSameAsContactAddress() {
        await this.waitForActiveTabToBe("Delivery Details");
        await this.click(this.isSameAsContactAddress);
    }
}

export default new DeliveryDetailsTab();