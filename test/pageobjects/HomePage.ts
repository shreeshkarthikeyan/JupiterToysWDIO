import { basePage } from "./index.js";

class HomePage extends basePage {

    constructor() {
        super();
    }
    
    public get btnStartShopping() {
        return $("//a[contains(text(),\"Start Shopping\")]");
    }

    public async clickStartShopping() : Promise<void> {
        await this.click(this.btnStartShopping);
    }
}

export default new HomePage();