import { setWorldConstructor, World } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import HomePage from "../../src/page-objects/homePage";
import CheckoutPage from "../../src/page-objects/checkoutPage";

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  homePage!: HomePage;
  checkoutPage!: CheckoutPage;

  async launchContext() {
    this.browser = await chromium.launch({ headless: false,  args: ["--start-maximized"]});
    this.context = await this.browser.newContext({ viewport: null });
    this.page = await this.context.newPage();
    this.homePage = new HomePage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
  }
  async close() {
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);