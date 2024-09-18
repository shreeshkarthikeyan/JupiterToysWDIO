import { orderOutcomePage, checkoutPage } from "./index.js";

class ConfirmOrderTab extends checkoutPage {

    
    constructor() {
        super();
    }

    public get btnSubmitOrder() {
        return this.activeTabContainer.$(".//button[.//text()='Submit Order']");
    }

    public get btnExpandAll() {
        return this.activeTabContainer.$(".//button[.//text()='Expand All']");
    }

    public async sectionContainer(sectionName : string) {
        await this.waitForActiveTabToBe("Confirm Order");
        return await (await this.activeTabContainer).$(".//mat-expansion-panel[.//mat-panel-title[contains(text(),'" + sectionName + "')]]");
        
    }

    public async findToyRow(toyName : string) {
        const sectionContainer = await this.sectionContainer("Order Details");
        return await sectionContainer.$(".//table/tbody//tr//td[contains(text(),\"" + toyName + "\")]/..");     
    }

    public async getCartItemUnitPrice(toyName : string) : Promise<string> {
        const toyRowContainer = await this.findToyRow(toyName);
        return await (await toyRowContainer.$(".//td[2]")).getText();
    }

    public async getCartItemQuantity(toyName : string) : Promise<string> {
        const toyRowContainer = await this.findToyRow(toyName);
        return await (await toyRowContainer.$(".//td[3]")).getText();
    }

    public async getCartItemSubTotal(toyName : string) : Promise<string> {
        const toyRowContainer = await this.findToyRow(toyName);
        return await (await toyRowContainer.$(".//td[4]")).getText();
    }

    public async getNumberOfCartItems() : Promise<number> {
        console.log("I am here");
        const sectionContainer = await this.sectionContainer("Order Details");
        console.log("cart items list => "+await sectionContainer.$$(".//table/tbody//tr").length);
        return await sectionContainer.$$(".//table/tbody//tr").length;
    }

    public async getDeliveryName() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Delivery & Contact Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Name')][1]/following-sibling::td[1]")).getText();
    }

    public async getContactName() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Delivery & Contact Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Name')][2]/following-sibling::td[1]")).getText();
    }

    public async getDeliveryAddress() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Delivery & Contact Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Address')][1]/following-sibling::td[1]")).getText();
    }

    public async getContactAddress() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Delivery & Contact Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Address')][2]/following-sibling::td[1]")).getText();
    }

    public async getContactEmailAddress() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Delivery & Contact Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Email')][1]/following-sibling::td[1]")).getText();
    }

    public async getContactNumber() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Delivery & Contact Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Phone')][1]/following-sibling::td[1]")).getText();
    }

    public async getCardName() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Payment Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Card Name')]/following-sibling::td[1]")).getText();
    }

    public async getCardNumber() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Payment Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Card Number')]/following-sibling::td[1]")).getText();
    }

    public async getCardType() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Payment Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Card Type')]/following-sibling::td[1]")).getText();
    }

    public async getCardExpiry() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Payment Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Card Expiry')]/following-sibling::td[1]")).getText();
    }

    public async getCardCVV() : Promise<string> {
        const sectionContainer = await this.sectionContainer("Payment Details");
        return await(await sectionContainer.$(".//table//tr//td[contains(text(),'Card CVV')]/following-sibling::td[1]")).getText();
    }

    public async clickExpandAll() : Promise<void> {
        await this.click(this.btnExpandAll);
    }

    public async clickSubmitOrder() : Promise<any> {
        await this.click(this.btnSubmitOrder);
        return orderOutcomePage;
    }
}

export default new ConfirmOrderTab();