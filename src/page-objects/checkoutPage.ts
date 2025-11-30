// src/page-objects/checkoutPage.ts
import { expect, Locator, Page } from "@playwright/test";
import { Frame } from "@playwright/test";
import BasePage from "./basePage";

export default class CheckoutPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }
  readonly signInCheckout = '[data-link-action="show-login-form"]'
   /**
    *  Selectors — Address Step
   */
  readonly addressAlias = '#field-alias';
  readonly addressFirstName = '#field-firstname';
  readonly addressLastName = '#field-lastname';
  readonly addressCompany = '#field-company';
  readonly addressVAT = '#field-vat_number';
  readonly addressLine1 = '#field-address1';
  readonly addressLine2 = '#field-address2';
  readonly addressCity = '#field-city';
  readonly addressPostcode = '#field-postcode';
  readonly addressPhone = '#field-phone';
  readonly fieldState = "#field-id_state";

  readonly continueToShippingBtn = 'button[name="confirm-addresses"]';
   /**
   *  Selectors — Shipping Step
   */
  readonly chooseCarrierSelector = '[name="delivery_option"]';
  readonly continueToPaymentBtn = '[name="confirmDeliveryOption"]';

   /**
   * Selectors — Payment Step
   */
  readonly termsCheckbox = '#conditions_to_approve\\[terms-and-conditions\\]';
  readonly confirmOrderBtn = '#payment-confirmation button[type="submit"]';

  get loginForm() {
    return this.frame.locator("#checkout-login-form");
  }

  async completeShipping() {
    await this.fillAddress();
    await this.goToPayment();
    await this.choosePaymentMethod();
    //this.confirmOrder();
  }
  /**
   * Helper: Always refresh frame safely
   */
  async freshFrame(): Promise<Frame> {
    try {
      return await this.getFrame();
    } catch (err) {
      // Check if page is closed
      if (!this.page || this.page.isClosed()) {
        console.warn("freshFrame skipped — page is already closed");
        throw err;
      }

      // Safe reload
      await this.loadFrame();
      return await this.getFrame();
    }
  }
  /**
   * ADDRESS STEP
   */
  async fillAddress(
    line1 = "123 Test Street",
    city = "Testville",
    postcode = "12345",
    phone = "555123456",
    state = "Alabama"
  ): Promise<void> {
    const frame = await this.freshFrame();
    await frame.fill(this.addressLine1, line1);
    await this.page.waitForTimeout(1000);
    await frame.fill(this.addressCity, city);
    await this.page.waitForTimeout(1000);
    await this.selectState(state);
    await this.page.waitForTimeout(1000);
    await frame.fill(this.addressPostcode, postcode);
    await this.page.waitForTimeout(1000);
    await frame.fill(this.addressPhone, phone);
    const btn = frame.locator(this.continueToShippingBtn);
    await expect(btn).toBeVisible({ timeout: 15000 });
    await btn.click();
    await this.page.waitForTimeout(3000);
  }

  async selectState(state: string): Promise<void> {
    const frame = await this.freshFrame();

    const dropdown = frame.locator(this.fieldState);
    await dropdown.waitFor({ state: "visible", timeout: 15000 });

    // Select by visible text
    await dropdown.selectOption({ label: state });

    // Ensure it was selected
    const selectedValue = await dropdown.inputValue();
    if (!selectedValue) throw new Error(`State "${state}" was not selected!`);
  }
  /**
   * SHIPPING STEP
   */
  async goToPayment(): Promise<void> {
    let frame = await this.freshFrame();
    const btn = frame.locator(this.continueToPaymentBtn);
    await expect(btn).toBeVisible({ timeout: 15000 });
    await btn.click();
    await this.page.waitForTimeout(3000);
  }
   /**
   * PAYMENT STEP
   */
  async choosePaymentMethod(): Promise<void> {
    let frame = await this.freshFrame();
    // Accept T&C
    const terms = frame.locator(this.termsCheckbox);
    await expect(terms).toBeVisible({ timeout: 15000 });
    await terms.check();
  }
  //NOTE: this option is not available in test ENV 
  async confirmOrder(): Promise<void> {
    let frame = await this.freshFrame();

    const btn = frame.locator(this.confirmOrderBtn);
    await expect(btn).toBeVisible({ timeout: 15000 });
    await btn.click();
  }

}
