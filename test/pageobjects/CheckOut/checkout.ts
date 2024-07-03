import Page from "../page.js";

export default class CheckOutPage extends Page {
 
    constructor() {
        super();
    }
    
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

    public async waitForActiveTabToBe(tabName : string) {
        const selectedTab = await (await this.pageContainer).$(".//mat-step-header[@ng-reflect-selected=\"true\"]");
        const tabText = await selectedTab.$(".//div[contains(@class,\"mat-step-text-label\")]");
        await browser.waitUntil(async function () {
            return (await tabText.getText()).includes(tabName);
        }, {
            timeout: 5000,
            timeoutMsg: 'expected tab is not selected'
        });
    }
}
