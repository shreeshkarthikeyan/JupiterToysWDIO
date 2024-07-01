import Page from "./page.js"

class ResultsPage extends Page {
    public get lblPaymentStatus() {
        return $("//div[contains(@class,'alert')]//strong[1]");
    }

    public get lblOrderNumber() {
        return $("//div[contains(@class,'alert')]//strong[1]");
    }

    public async getPaymentStatus() : Promise<string> {
        await this.checkForVisibility($("//a[contains(text(),'Shopping Again')]"));
        return (await (await this.lblPaymentStatus).getText()).trim();
    }

    public async getOrderNumber() : Promise<string> {
        await this.checkForVisibility($("//a[contains(text(),'Shopping Again')]"));
        return (await (await this.lblOrderNumber).getText()).trim();
    }
}

export default new ResultsPage();