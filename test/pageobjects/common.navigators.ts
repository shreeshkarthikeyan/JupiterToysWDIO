import { $ } from '@wdio/globals'
import Page from './page.js';

class CommonNavigators extends Page {
    
    public get toolBarContainer () {
        return $("<mat-toolbar>");
    }

    public get btnHome () {
        return this.toolBarContainer.$(".//button[.//text()='Home']");
    }

    public get btnShop () {
        return this.toolBarContainer.$(".//button[.//text()='Shop']");
    }

    public get btnCart () {
        return this.toolBarContainer.$(".//button[.//text()='Cart']");
    }

    public get menuBarExpander() {
        return this.toolBarContainer.$(".//button[contains(@class,'mat-menu-trigger mat-icon-button')]");
    }

    public get menuBarContainer() {
        return $(".//div[contains(@class, 'mat-menu-panel')]");
    }

    public get btnContact() {
        return this.menuBarContainer.$(".//button[.//text()='Contact']");
    }

    public get btnLogin() {
        return this.menuBarContainer.$(".//button[.//text()='Login']");
    }

    public async clickHome () {
        await this.click(this.btnHome);
    }

    public async clickShop () {
        await this.click(this.btnShop);
    }

    public async clickCart () {
        await this.click(this.btnCart);
    }

    public async clickContact () {
        await this.click(this.menuBarExpander);
        await this.click(this.btnContact)
    }

    public async clickLogin () {
        await this.click(this.menuBarExpander);
        await this.click(this.btnLogin)
    }
}

export default new CommonNavigators();