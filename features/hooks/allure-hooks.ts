import { After, ITestCaseHookParameter, Status } from "@cucumber/cucumber";
import { CustomWorld } from "../step-definitions/world.js";
import * as fs from "fs";
import * as path from "path";


After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  // Take screenshot only if scenario failed and page exists
  if (scenario.result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
    const screenshotPath = path.join(
      process.cwd(),
      "screenshots",
      `${scenario.pickle.name.replace(/ /g, "_")}.png`
    );
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    const buffer = await this.page.screenshot();
    fs.writeFileSync(screenshotPath, buffer);
  }
  if (this.browser && this.browser.isConnected()) {
    await this.browser.close();
  }
});
