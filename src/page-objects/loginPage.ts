// src/page-objects/loginPage.ts
import { expect, Page } from "@playwright/test";
import BasePage from "./basePage";

export default class LoginPage extends BasePage {
  /**Selectors Create account */
  readonly signInButton = "[class='user-info']";
  readonly createAccountBtn = "[data-link-action='display-register-form']";
  readonly saveButton = "[data-link-action='save-customer']"

  /** Selectors — Registration fields*/
  readonly genderMr = "#field-id_gender-1";
  readonly genderMrs = "#field-id_gender-2";
  readonly firstNameInput = "#field-firstname";
  readonly lastNameInput = "#field-lastname";
  readonly emailInput = "#field-email";
  readonly passwordInput = "#field-password";
  readonly birthdayInput = "#field-birthday";
  readonly checkboxOffers = "[name='optin']"; // Receive offers from partners
  readonly checkboxNewsletter = "[name='newsletter']"; // Sign up for newsletter
  readonly checkboxPrivacy = "[name='psgdpr']"; // Terms & Conditions
  readonly checkboxDataPrivacy = "[name='customer_privacy']"; // Customer data privacy (if exists)


  constructor(page: Page) {
    super(page);
  }

  async registerAndLogin(
    email: string,
    password: string,
    firstName = "Test",
    lastName = "User",
    gender: "Mr" | "Mrs" = "Mr",
    birthDate = "01/01/1990"
  ): Promise<void> {
    try {
      // Always load frame before doing anything
      await this.loadFrame();
      let frame = await this.getFrame();

      // Open Sign-In panel
      const signInBtn = frame.locator(this.signInButton);
      await expect(signInBtn).toBeVisible({ timeout: 15000 });
      await signInBtn.click();

      // Click Create Account
      const createBtn = frame.locator(this.createAccountBtn);
      await expect(createBtn).toBeVisible({ timeout: 15000 });
      await createBtn.click();

      // Gender selection
      if (gender === "Mr") {
        await frame.locator(this.genderMr).check();
      } else {
        await frame.locator(this.genderMrs).check();
      }

      // Fill registration fields
      await frame.fill(this.firstNameInput, firstName);
      await frame.fill(this.lastNameInput, lastName);
      await frame.fill(this.emailInput, email);
      await frame.fill(this.passwordInput, password);
      await frame.fill(this.birthdayInput, birthDate);

      // Check checkboxes (scroll to be safe)
      await frame.locator(this.checkboxOffers).scrollIntoViewIfNeeded();

      await frame.locator(this.checkboxOffers).check();
      await frame.locator(this.checkboxNewsletter).check();
      await frame.locator(this.checkboxPrivacy).check();
      await frame.locator(this.checkboxDataPrivacy).check();

      // Submit the form
      const saveBtn = frame.locator(this.saveButton);
      await expect(saveBtn).toBeVisible({ timeout: 15000 });
      await saveBtn.click();

      await frame.waitForTimeout(3000);

      // Refresh frame after navigation
      this.frame = await this.getFrame();

    } catch (e: any) {
      if (e.message.includes("Frame was detached")) {
        console.log("⚠ Frame detached — retrying registerAndLogin()");
        await this.loadFrame();
        return this.registerAndLogin(email, password, firstName, lastName, gender, birthDate);
      }
      throw e;
    }
  }

}
