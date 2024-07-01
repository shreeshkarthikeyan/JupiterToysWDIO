import { IDeliveryDetails } from "../../model/delivery.details.js";
import CheckOutPage from "./checkout.js";

class DeliveryDetailsTab extends CheckOutPage {

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

    public async addDeliveryDetails(deliveryDetails: IDeliveryDetails) : Promise<void> {
        if(deliveryDetails.isSameAsContactAddress) {
            let classValue = await (await this.isSameAsContactAddress).getAttribute("class");
            if(!(classValue.includes("mat-radio-checked"))) {
                this.click(this.isSameAsContactAddress);
            }
        }else {
            let classValue = await (await this.isNotSameAsContactAddress).getAttribute("class");
            if(!(classValue.includes("mat-radio-checked"))) {
                this.click(this.isNotSameAsContactAddress);
            } 
            this.enterValue(this.inpName, deliveryDetails.name);
            this.enterValue(this.inpAddressLine1, deliveryDetails.addressline1);
            this.enterValue(this.inpAddressLine2, deliveryDetails.addressline2);
            this.enterValue(this.inpSuburb, deliveryDetails.suburb);
            this.selectOption(this.selectState, deliveryDetails.state);
            this.enterValue(this.inpPostcode, deliveryDetails.postcode);
        }
    }
}

export default new DeliveryDetailsTab();