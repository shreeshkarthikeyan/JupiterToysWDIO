import Page from './page.js';

class ShopPage extends Page {
    
    constructor() {
        super();
    }

    public get toysContainer() {
        return $(".products");
    }

    public async toyContainer(toy: string){
        //await this.checkForVisibility( await (await this.toysContainer).$("//h4[text()=\"" + toy + "\"]/.."));
        //return await (await this.toysContainer).$("//h4[text()=\"" + toy + "\"]/..");
        await this.checkForVisibility(await this.toysContainer);
        const toysContainer  = await (await this.toysContainer).$$(".//li[contains(@class,\"product\")]");
        console.log("Toys items present in the page: " + toysContainer.length);
        if(toysContainer.length === 0)
            throw new Error("No items are present in the page");

        const toyContainer = await toysContainer.filter(async function (elem) {
            return (await elem.getText()).includes(toy);
        });
        
        if(toyContainer.length === 0)
            throw new Error(toy + " is not present in the page");

        return toyContainer.at(0);
    }

    public async addToy(toy: string, quantity: number) : Promise<this> {
        let toyContainer = await this.toyContainer(toy);
        for(let i = 0 ; i < quantity; i++) {
            await this.click(await toyContainer?.$(".//a[text()='Buy']"));
            await this.checkForVisibility(await $("//div[@class=\"cdk-overlay-container\"]"));
        };
        return this;
    }

    public async getToyPrice(toy: string): Promise<any> {
        let toyContainer = await this.toyContainer(toy);
        let price = (await (await toyContainer?.$(".//span[contains(@class,'product-price')]"))?.getText())?.trim().replace("$","");
        return price;
    }
}

export default new ShopPage();