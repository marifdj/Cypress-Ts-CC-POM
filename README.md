# Playwright -Ts-CC-POM
# Automated Testing Framework

This project is a **robust automated testing framework** built with **Playwright**, **TypeScript**, and **Cucumber**, following the **Page Object Model (POM)** design pattern. It enables fast, reliable, and maintainable UI testing across multiple browsers. Using **BDD (Behavior-Driven Development)** with Cucumber, test scenarios are written in a human-readable format, allowing both technical and non-technical team members to understand and collaborate on test cases. Tests can be easily organized and executed using **tags**, such as `@desktop` or `@smoke`, for flexible and targeted test runs.

---

## Key Features

- **Playwright** for reliable and fast browser automation.
- **TypeScript** for type safety and maintainable code.
- **Cucumber** for BDD and readable test scenarios.
- **Page Object Model (POM)** for organized, reusable page interactions.
- **Tag-based test execution** for running specific groups of tests.

---

## How It Works

1. **Feature Files (Gherkin Syntax)**  
   Test scenarios are written in `.feature` files using plain English steps (Given, When, Then), making them readable for all team members.

2. **Step Definitions**  
   Each step in a feature file is linked to a **TypeScript function** in the `step-definitions` folder. These functions implement the automation logic.

3. **Page Object Model (POM)**  
   Page objects in the `pages/` folder encapsulate all page interactions, keeping tests organized, reusable, and maintainable.

4. **Playwright for Automation**  
   Playwright handles browser automation, running tests across Chromium, Firefox, and WebKit.

5. **Cucumber Tags**  
   Tests can be grouped using tags (e.g., `@desktop`, `@smoke`) to execute only specific scenarios:

## Prerequisites --> 
npm install
npx playwright install

## Run All Tests
npx cucumber-js || npm run test

How to execute existing cases --> 

   npx cucumber-js --tags "@desktop"


## Reporting and Screenshots

### Allure Reports

This framework integrates **Allure Reports** to provide detailed and interactive test results. Allure offers:

- Step-by-step results for each scenario (passed, failed, skipped).  
- Visual dashboards with charts, trends, and categories.  
- Support for attachments such as screenshots, logs, and videos.  

**Benefits:**

- Quickly identify failing tests and their causes.  
- Historical trends for test quality over time.  
- Easy collaboration between QA and developers through readable reports.  

