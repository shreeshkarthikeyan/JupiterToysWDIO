import Page from "../page.js";

export default class CheckOutPage extends Page {

    public get pageContainer() {
        return $("<app-checkout>");
    }

    public get activeTabContainer() {
        return this.pageContainer.$(".//div[contains(@style,'visibility: inherit;')]");
    }

    public get btnNext() {
        return this.activeTabContainer.$(".//button[contains(@class,'mat-stepper-next')]");
    }

    public async clickNext() {
        await this.click(this.btnNext);
    }
}
