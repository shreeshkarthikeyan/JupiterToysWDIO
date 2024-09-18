import { ContactDetails } from "../../data/index.js";
import CheckoutPage from "./CheckoutPage.js";

class ContactDetailsTab extends CheckoutPage {
    constructor() {
        super();
    }
    
    public get inputFirstName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='firstName']");
    }

    public get inputLastName() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='lastName']");
    }

    public get inputEmail() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='email']");
    }

    public get inputPhoneNumber() {
        return this.activeTabContainer.$(".//input[@ng-reflect-name='phonenumber']");
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

    public async addContactDetails(contactDetails: ContactDetails) : Promise<void> {
        await this.enterValue(this.inputFirstName, contactDetails.firstname);
        await this.enterValue(this.inputLastName, contactDetails.lastname);
        await this.enterValue(this.inputEmail, contactDetails.email);
        await this.enterValue(this.inputPhoneNumber, contactDetails.phoneNumber);
        await this.enterValue(this.inputAddressLine1, contactDetails.addressline1);
        await this.enterValue(this.inputAddressLine2, contactDetails.addressline2);
        await this.enterValue(this.inputSuburb, contactDetails.suburb);
        await this.selectOption(this.selectState, contactDetails.state);
        await this.enterValue(this.inputPostcode, contactDetails.postcode);
    }
}

export default new ContactDetailsTab();