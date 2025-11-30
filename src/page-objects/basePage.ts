import { Page, Frame } from "@playwright/test";

export default class BasePage {
  frame!: Frame;

  constructor(public page: Page) { }

  /**
   * Load the site + initial iframe
   */
  async loadFrame(): Promise<void> {
    if (!this.page || this.page.isClosed()) throw new Error("Page is closed");

    await this.page.goto("https://demo.prestashop.com/", {
      timeout: 60000,
      waitUntil: "domcontentloaded",
    });

    const frameElement = await this.page.waitForSelector("iframe#framelive", {
      timeout: 60000,
      state: "attached",
    });

    const frame = await frameElement.contentFrame();
    if (!frame) throw new Error("Could not load PrestaShop iframe");

    this.frame = frame;
    await frame.waitForLoadState("domcontentloaded");
  }

  /**
   * Always get a fresh iframe reference.
   * Returns a guaranteed Frame instance.
   */
  async getFrame(): Promise<Frame> {
    if (!this.page || this.page.isClosed()) throw new Error("Page is closed");

    const frameElement = await this.page.waitForSelector("iframe#framelive", {
      timeout: 60000,
      state: "attached",
    });

    const frame = await frameElement.contentFrame();
    if (!frame) throw new Error("Frame not loaded!"); // Ensure non-null

    this.frame = frame;
    await frame.waitForLoadState("domcontentloaded");

    return frame;
  }
}
