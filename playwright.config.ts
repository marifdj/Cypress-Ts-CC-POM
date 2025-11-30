import { defineConfig } from "@playwright/test";

export default defineConfig({
    use: {
        headless: false,
        video: "retain-on-failure",
        screenshot: "only-on-failure",
        actionTimeout: 10000,         
        navigationTimeout: 20000,
      },
    timeout: 60000,                 // per test
    expect: { timeout: 10000 },     // expect() timeout
});