import Page from "../page.js";

export default class CheckOutPage extends Page {

    public get pageContainer() {
        return $("<app-checkout>");
    }

    public get activeTabContainer() {
        return this.pageContainer.$(".//div[@role=\"tabpanel\" and @aria-expanded=\"true\"]");
    }

    public get btnNext() {
        return this.activeTabContainer.$(".//button[contains(@class,'mat-stepper-next')]");
    }

    public async clickNext() {
        await this.click(this.btnNext);
    }
}
