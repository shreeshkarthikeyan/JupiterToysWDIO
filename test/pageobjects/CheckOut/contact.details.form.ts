import { ContactDetails } from "../../model/contact.details.js";
import CheckoutPage from "./checkout.js";
import deliveryDetailsForm from "./delivery.details.form.js";

class ContactDetailsTab extends CheckoutPage {

    
    constructor() {
        super();
    }
    
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

    public async addContactDetails(contactDetails: ContactDetails) : Promise<void> {
        await this.enterValue(this.inpFirstName, contactDetails.firstname);
        await this.enterValue(this.inpLastName, contactDetails.lastname);
        await this.enterValue(this.inpEmail, contactDetails.email);
        await this.enterValue(this.inpPhoneNumber, contactDetails.phoneNumber);
        await this.enterValue(this.inpAddressLine1, contactDetails.addressline1);
        await this.enterValue(this.inpAddressLine2, contactDetails.addressline2);
        await this.enterValue(this.inpSuburb, contactDetails.suburb);
        await this.selectOption(this.selectState, contactDetails.state);
        await this.enterValue(this.inpPostcode, contactDetails.postcode);
    }

    public async clickNext() :Promise<any> {
        await super.clickNext();
        await this.waitForActiveTabToBe("Delivery Details");
        return deliveryDetailsForm;
    }
}

export default new ContactDetailsTab();