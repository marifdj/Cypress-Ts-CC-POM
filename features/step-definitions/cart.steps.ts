import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import LoginPage from "../../src/page-objects/loginPage";
import { generateTempEmail, generateTempPassword } from "../../src/utils/tempEmail";

// Desktop
Given("I open the store", { timeout: 600000 },async function (this: CustomWorld) {
  await this.launchContext();
  await this.homePage.open();
});
Given("I register and login with temporary credentials", { timeout: 1000000 }, async function () {
  const loginPage = new LoginPage(this.page);
  const email = generateTempEmail();
  const password = generateTempPassword();
  // Store in world for later steps
  this.testUser = { email, password };
  await loginPage.registerAndLogin(email, password);
});
When("I add {int} products to the cart",{ timeout: 1000000 },async function (this: CustomWorld, count: number) {
  await this.homePage.addMultipleRandomProducts(count);
});
When("I proceed to checkout", { timeout: 1000000 } ,async function (this: CustomWorld) {
  await this.homePage.goToCheckout();
});
Then ("I complete all the fields in the checkout page", { timeout: 1000000 } ,async function (this: CustomWorld) {
  await this.checkoutPage.completeShipping();
});

