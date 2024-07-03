import Page from './page.js';

class ShopPage extends Page {
    
    constructor() {
        super();
    }

    public get toysContainer() {
        return $(".products");
    }

    public async toyContainer(toy: string) : Promise<WebdriverIO.Element> {
        await this.checkForVisibility( await (await this.toysContainer).$("//h4[text()=\"" + toy + "\"]/.."));
        return await (await this.toysContainer).$("//h4[text()=\"" + toy + "\"]/..");
    }

    public async addToy(toy: string, quantity: number) : Promise<this> {
        let toyContainer = await this.toyContainer(toy);
        for(let i = 0 ; i < quantity; i++) {
            await this.click(await toyContainer.$(".//a[text()='Buy']"));
            await this.checkForVisibility(await $("//div[@class=\"cdk-overlay-container\"]"));
        };
        return this;
    }

    public async getToyPrice(toy: string): Promise<number> {
        let toyContainer = await this.toyContainer(toy);
        return parseFloat((await (await toyContainer.$(".//span[contains(@class,'product-price')]"))
            .getText())
            .replace("$","")
            .trim());
    }
}

export default new ShopPage();