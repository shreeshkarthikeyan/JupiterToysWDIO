import Page from './BasePage.js';

class ShopPage extends Page {
    
    constructor() {
        super();
    }

    public get toysContainer() {
        return $(".products");
    }

    public async toyContainer(toy: string) {
        await this.checkForVisibility(await this.toysContainer);
        return await (await this.toysContainer).$(".//li[contains(@class,\"product\") and .//h4[contains(text(),\"" + toy + "\")]]");
    }

    public async addToy(toy: string, quantity: number) : Promise<this> {
        let toyContainer = await this.toyContainer(toy);
        for(let i = 0 ; i < quantity; i++) {
            await this.click(await toyContainer.$(".//a[text()='Buy']"));
            await this.checkForVisibility(await $("//div[@class=\"cdk-overlay-container\"]"));
        };
        return this;
    }

    public getToyPrice = async (toy : string) : Promise<any> => {
        let toyContainer = await this.toyContainer(toy);
        let price = (await (await toyContainer.$(".//span[contains(@class,'product-price')]")).getText()).trim().replace("$","");
        return price;
    }
}

export default new ShopPage();