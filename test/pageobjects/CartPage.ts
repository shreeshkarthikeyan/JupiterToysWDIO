import { ContactDetailsTab } from "./CheckOut/index.js";
import Page from "./BasePage.js";

class CartPage extends Page {
    
    constructor() {
        super();
    }

    public get pageContainer() {
        return $("<app-cart>");
    }

    public get tableContainer() {
        return this.pageContainer.$("<table>");
    }

    public get totalPrice() {
        return this.tableContainer.$(".//td[contains(@class,'column-total')]/strong");
    }

    public get btnCheckOut() {
        return this.pageContainer.$(".//a[contains(@class,'btn-checkout')]");
    }

    public async toyRowContainer(toyName : string) : Promise<WebdriverIO.Element> {
        await this.checkForVisibility(await (await this.tableContainer).$(".//td[text()=\" " + toyName + " \"]/.."));
        return await (await this.tableContainer).$(".//td[text()=\" " + toyName + " \"]/..");
    }

    public async getToyQuantity(toyName : string) : Promise<string> {
        const toyRowContainer = this.toyRowContainer(toyName);
        console.log(toyName + "'s quantity : " + await (await (await toyRowContainer).$("<input>")).getAttribute("ng-reflect-value"));
        return await (await (await toyRowContainer).$("<input>")).getAttribute("ng-reflect-value");
    }

    public async getToySubTotal(toyName: string) : Promise<string> {
        const toyRowContainer = this.toyRowContainer(toyName);
        console.log(toyName + "'s price : " + await (await (await toyRowContainer).$(".//td[4]")).getText());
        return await (await (await toyRowContainer).$(".//td[4]")).getText();
    }

    public async getTotalPrice() {
        console.log("Total price : "+ await (await this.totalPrice).getText());
        return await (await this.totalPrice).getText();
    }

    public async clickCheckout() {
        await this.click(this.btnCheckOut);
        return ContactDetailsTab;
    }
}

export default new CartPage();