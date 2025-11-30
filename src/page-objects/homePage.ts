import { expect, Locator } from "@playwright/test";
import BasePage from "../page-objects/basePage";

export default class HomePage extends BasePage {
  /** Selectors — Cart */
  readonly productCard = '[class="product-miniature js-product-miniature"]';
  readonly addToCartButton = "[data-button-action='add-to-cart']";
  readonly cartModal = "#blockcart-modal";
  readonly continueShoppingBtn = 'button:has-text("Continue shopping")';
  readonly proceedToCheckoutBtn = 'a:has-text("Proceed to checkout")';
  readonly cartDesktop = '[class="material-icons shopping-cart"]';
  readonly homeLogo = '#_desktop_logo';
  readonly mobileBtn = '//*[@id="devices"]/li[4]/a/i';
  /**
    *  OPEN STORE (called ONCE)
   */

  async open() {
    await this.loadFrame();    // only once
  }
  /**
    *  RETURNS FIRST VISIBLE <a> LINK for a product
   */
  async getVisibleProductLink(product: Locator): Promise<Locator> {
    const links = product.locator("a.thumbnail.product-thumbnail");
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const box = await link.boundingBox();
      if (box && box.width > 0 && box.height > 0) {
        return link; // first visible link
      }
    }

    throw new Error("No visible product link found");
  }
  /**
    *  ADD x RANDOM UNIQUE PRODUCTS
   */

  async addMultipleRandomProducts(count: number) {
    let frame = await this.getFrame(); // always use fresh frame

    await frame.waitForSelector(this.productCard, { timeout: 60000 });

    const cards = frame.locator(this.productCard);
    const total = await cards.count();

    if (total === 0) {
      throw new Error("No products found!");
    }

    // collect visible product cards
    const visible: Locator[] = [];
    for (let i = 0; i < total; i++) {
      const product = cards.nth(i);
      const box = await product.boundingBox();
      if (box) visible.push(product);
    }

    if (visible.length < count) {
      throw new Error(`Requested ${count}, but only ${visible.length} visible.`);
    }

    // pick X unique random indices
    const chosen = new Set<number>();
    while (chosen.size < count) {
      chosen.add(Math.floor(Math.random() * visible.length));
    }

    // process each selected product
    for (const index of chosen) {
      const product = visible[index];

      // retry logic for frame detachment
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          frame = await this.getFrame();

          const link = await this.getVisibleProductLink(product);
          await link.scrollIntoViewIfNeeded();
          await expect(link).toBeVisible({ timeout: 10000 });

          await link.click(); // enter product page
          await this.page.waitForTimeout(4000);

          const addBtn = frame.locator(this.addToCartButton);
          await expect(addBtn).toBeVisible();
          await addBtn.click();

          const modal = frame.locator(this.cartModal);
          await expect(modal).toBeVisible({ timeout: 15000 });

          const continueBtn = modal.locator(this.continueShoppingBtn);
          await expect(continueBtn).toBeVisible({ timeout: 15000 });
          await continueBtn.click();

          // Go back home
          await frame.locator(this.homeLogo).click();
          await this.page.waitForTimeout(2000);

          break; // success

        } catch (err: any) {
          console.log(`⚠ Retry adding product (attempt ${attempt})`);
          if (attempt === 3) throw err;
          await this.page.waitForTimeout(2000);
        }
      }
    }
  }
  /**
     *  PROCEED TO CHECKOUT
    */
  async goToCheckout(): Promise<void> {
    try {
      // Always refresh the frame before interacting
      this.frame = await this.getFrame();

      // Wait for the cart icon
      const cart = this.frame.locator(this.cartDesktop);
      await cart.waitFor({ state: "visible", timeout: 15000 });
      await cart.click();

      // Wait for checkout button
      const checkoutBtn = this.frame.locator(this.proceedToCheckoutBtn);
      await checkoutBtn.waitFor({ state: "visible", timeout: 15000 });
      await checkoutBtn.click();

      // Let the page load
      await this.page.waitForTimeout(2000);

    } catch (e: any) {
      if (e.message.includes("Frame was detached")) {
        console.log("⚠ Frame detached — retrying goToCheckout()");
        await this.loadFrame();
        return this.goToCheckout();
        //click on signIn
      }
      throw e;
    }
  }
}
