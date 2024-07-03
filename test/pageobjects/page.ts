import { browser } from '@wdio/globals'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open () {
        return browser.url("https://ec2-54-206-101-9.ap-southeast-2.compute.amazonaws.com:5200/home");
    }

    public async click(element: any) {
        await this.checkForVisibility(element);
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
}
