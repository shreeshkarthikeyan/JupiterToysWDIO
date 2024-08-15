import Page from "./BasePage.js"

class HomePage extends Page {

    constructor() {
        super();
    }
    
    public get btnStartShopping() {
        return $("//a[contains(text(),\"Start Shopping\")]");
    }

    public async clickStartShopping() {
        await this.click(this.btnStartShopping);
    }
}

export default new HomePage();