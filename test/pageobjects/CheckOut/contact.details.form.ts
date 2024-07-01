import { IContactDetails } from "../../model/contact.details.js";
import CheckoutPage from "./checkout.js";

class ContactDetailsTab extends CheckoutPage {

    public get inpFirstName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='firstName']");
    }

    public get inpLastName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='lastName']");
    }

    public get inpEmail() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='email']");
    }

    public get inpPhoneNumber() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='phonenumber']");
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

    public async addContactDetails(contactDetails: IContactDetails) : Promise<void> {
        this.enterValue(this.inpFirstName, contactDetails.firstname);
        this.enterValue(this.inpLastName, contactDetails.lastname);
        this.enterValue(this.inpEmail, contactDetails.email);
        this.enterValue(this.inpPhoneNumber, contactDetails.phoneNumber);
        this.enterValue(this.inpAddressLine1, contactDetails.addressline1);
        this.enterValue(this.inpAddressLine2, contactDetails.addressline2);
        this.enterValue(this.inpSuburb, contactDetails.suburb);
        this.selectOption(this.selectState, contactDetails.state);
        this.enterValue(this.inpPostcode, contactDetails.postcode);
    }
}

export default new ContactDetailsTab();