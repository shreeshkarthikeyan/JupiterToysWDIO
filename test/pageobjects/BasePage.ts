import { browser } from '@wdio/globals'
import { $ } from '@wdio/globals'
import shop from './ShopPage.js';
//import cart from './cart.js';

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {

    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */

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


    public navigateToUrl () {
        return browser.url("https://ec2-54-206-101-9.ap-southeast-2.compute.amazonaws.com:5200/home");
    }

    public async clickHome() : Promise<this> {
        await this.click(this.btnHome);
        return this;
    }

    public async clickShop () {
        await this.click(this.btnShop);
        return shop;
    }

    public async clickCart() {
        await this.click(this.btnCart);
        //return cart;
    }

    public async clickContact () {
        await this.click(this.menuBarExpander);
        await this.click(this.btnContact)
    }

    public async clickLogin () {
        await this.click(this.menuBarExpander);
        await this.click(this.btnLogin)
    }

    public async click(element: any) {
        await this.checkForVisibility(element);
        await this.checkForClickability(element);
        await element.click();
    }

    public async enterValue(element: any, text: any) {
        await this.checkForVisibility(element);
        await element.clearValue();
        browser.pause(500);
        await element.setValue(text);
    }

    public async selectOption(element: any, text: string) {
        await this.click(element);
        await this.checkForVisibility($("//mat-option[@ng-reflect-value='" + text + "']"));
        await this.click($("//mat-option[@ng-reflect-value='" + text + "']"));
    }

    public async checkForVisibility(element: any) {
        await element.waitForDisplayed( { timeout: 10000, timeoutMsg: "element not visible"}); 
    }

    public async checkForClickability(element: any) {
        await element.waitForClickable( { timeout: 10000, timeoutMsg: "element not clickable after visibility"}); 
    }
}
