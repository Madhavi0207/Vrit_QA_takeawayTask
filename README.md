# Authorized Partner – Sign Up Automation

End-to-end UI test automation for the sign-up flow of the **Authorized Partner** web application, built with Playwright, Cucumber (BDD) and TypeScript using the Page Object Model.

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Scenarios](#test-scenarios)
- [Test Reports](#test-reports)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Author](#author)
- [Demo Video](#demo-video)

## Project Overview

This project automates the agency registration (sign-up) journey of the Authorized Partner platform. It verifies that a new user can register from every entry point, reaches the dashboard, and sees the entered details saved correctly on the profile page.

- **Application under test:** https://authorized-partner.vercel.app/
- **Type of testing:** UI / End-to-End (E2E)
- **Testing approach:** BDD with Cucumber (Gherkin) and the Page Object Model
- **Main functionalities covered:**
  - Opening the sign-up page from three entry points (header, hero and bottom buttons)
  - Accepting the privacy terms and conditions
  - Entering user details
  - One-time code (OTP) email verification
  - Entering agency details
  - Entering professional experience details
  - Entering business details and uploading a document
  - Verifying the dashboard loads after registration
  - Verifying the entered details on the profile page (personal information, agency details, lead form URL and uploaded document)

## Objectives

- Automate the critical sign-up workflow.
- Validate that every sign-up entry point leads to a successful registration.
- Verify OTP email verification end to end using a real inbox.
- Confirm the entered data is saved correctly and shown on the profile page.
- Identify and report defects early.
- Reduce repetitive manual testing.

## Tech Stack

| Technology     | Version           | Purpose                                   |
| -------------- | ----------------- | ----------------------------------------- |
| Playwright     | 1.65.1            | Browser automation (Chromium)             |
| TypeScript     | 6.0.3             | Programming language                      |
| ts-node        | 10.9.2            | Runs TypeScript without a build step      |
| Cucumber.js    | 7.3.1             | BDD test framework                        |
| Node.js        | 22 (minimum 20)   | JavaScript runtime                        |
| npm            | bundled with Node | Package management                        |
| dotenv         | 17.4.2            | Loads environment variables               |
| Testmail.app   | –                 | Disposable inbox to receive the OTP email |
| Git & GitHub   | –                 | Version control                           |
| GitHub Actions | –                 | CI/CD automation                          |

No separate browser driver is required. Playwright downloads and manages Chromium itself.

## Project Structure

```text
vrit_qa_takeawaytask/
│
├── e2e/
│   ├── features/
│   │   └── signUp.feature          # Gherkin scenarios
│   ├── pageObject/
│   │   └── SignUpPage.ts           # Locators, actions and profile verification
│   ├── stepDefinitions/
│   │   └── signUpContext.ts        # Step definitions mapped to the page object
│   ├── support/
│   │   └── CustomWorld.ts          # Cucumber World (browser, page, shared data)
│   └── utilities/
│       └── testmail.ts             # Generates test emails and fetches the OTP
│
├── phoneNumber/
│   └── phoneNumber.ts              # Random phone number generator
├── sample-file-upload/
│   └── sample-file.pdf             # File uploaded in the business details step
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI pipeline
│
├── .env                            # Local secrets (git-ignored, you create this)
├── .gitignore
├── cucumber.conf.js                # Browser lifecycle hooks
├── package.json
├── tsconfig.json
└── README.md
```

**Key files**

- `signUp.feature` – the business-readable test scenarios.
- `SignUpPage.ts` – all locators and page actions for the sign-up journey, plus `verifyProfileDetails()` for the profile page checks.
- `signUpContext.ts` – connects Gherkin steps to page object methods.
- `testmail.ts` – creates a unique email per run and reads the 6-digit OTP through the Testmail API.
- `phoneNumber.ts` – generates a random 10-digit phone number starting with `98`.
- `cucumber.conf.js` – launches the browser once, then creates and closes a fresh context and page for every scenario.

## Prerequisites

Ensure the following are installed:

- **Node.js 22** (Node 20 is the minimum required by Playwright). Check with `node -v`.
- **npm** (`npm -v`)
- **Git**
- **Chromium**, installed through Playwright in the setup steps below
- **A free Testmail.app account** (see [Configuration](#configuration))
- Internet access, because the tests run against the live deployed site

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project

```bash
cd vrit_qa_takeawaytask
```

### 3. Install Dependencies

```bash
npm ci
```

`npm ci` installs the exact versions from `package-lock.json`. You can use `npm install` instead.

### 4. Install Playwright Browsers

```bash
npx playwright install chromium
```

## Configuration

### Testmail account (required)

The sign-up flow sends a one-time code (OTP) by email. The tests read it automatically through [Testmail.app](https://testmail.app/), so **you must create your own Testmail account and use your personal API key and namespace**. Without them the tests cannot complete the OTP step.

1. Go to https://testmail.app/ and **sign up** for a free account.
2. Open the Testmail **console** after logging in.
3. Copy your **Namespace** and your **API Key** from the console.
4. Add them to a `.env` file as shown below.

### Environment variables

Create a `.env` file in the root directory:

```env
TESTMAIL_API_KEY=your_personal_testmail_api_key
TESTMAIL_NAMESPACE=your_personal_testmail_namespace
```

| Variable             | Description                                       |
| -------------------- | ------------------------------------------------- |
| `TESTMAIL_API_KEY`   | Your personal API key from the Testmail console   |
| `TESTMAIL_NAMESPACE` | Your personal namespace from the Testmail console |

For every run, the tests generate a unique address in the form `<namespace>.<random-tag>@inbox.testmail.app`. Testmail receives the OTP email there, and the helper fetches the 6-digit code through the API.

**Note:** `.env` is git-ignored. Never commit actual credentials, API keys, or other secrets to GitHub.

### Test data and accounts used

**Accounts:** No existing application account is needed. A new account is registered on every run. The only external account required is your Testmail account described above.

**Dynamically generated per run**

| Field        | How it is generated                                |
| ------------ | -------------------------------------------------- |
| Email        | Unique Testmail address with a random tag          |
| Phone number | `98` followed by 8 random digits (10 digits total) |
| OTP          | Read from the Testmail inbox                       |

**Static data** (defined in `e2e/features/signUp.feature`)

| Step               | Data                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| User details       | First name `Madhavi`, last name `Paudel`, password `Hellow@123` (confirmed with the same value)                                   |
| Agency details     | Name `KanyaCampus`, role `Student`, email `info@kanyacampus.edu.np`, website `kanyacampus.com`, address `Pokhara`, region `Nepal` |
| Experience details | `10+ years`, `300` students, focus area `Management`, success metrics `80`, service `Career Counseling`                           |
| Business details   | Registration number `01234578`, country `Australia`, institution `Universities`, certification `hello this is test`               |
| Uploaded file      | `sample-file-upload/sample-file.pdf`                                                                                              |

The password and other values are dummy data used only for automated test accounts.

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Feature

```bash
npx cucumber-js e2e/features/signUp.feature \
  --require-module ts-node/register \
  --require "e2e/stepDefinitions/**/*.ts" \
  --require cucumber.conf.js
```

### Run a Single Entry Point

```bash
npx cucumber-js e2e/features/signUp.feature \
  --require-module ts-node/register \
  --require "e2e/stepDefinitions/**/*.ts" \
  --require cucumber.conf.js \
  --name "Sign up from the hero entry point"
```

### Headed and Headless Mode

Browser mode follows the `CI` environment variable (see `cucumber.conf.js`):

- **Headed (default locally):** when `CI` is not set, the browser window is visible. This is useful for debugging and recording the demo.
- **Headless:** when `CI=true`.

```bash
# macOS / Linux / Git Bash
CI=true npm run test:e2e

# Windows PowerShell
$env:CI="true"; npm run test:e2e
```

### Type Check

```bash
npm run typecheck
```

**Expected result:** 3 scenarios (one per entry point) and 24 steps pass. Each run usually takes about 1.5 minutes in total, depending on how quickly the OTP email arrives. The step timeout is 160 seconds.

## Test Scenarios

The feature `Sign Up` contains one **Scenario Outline**, executed once for each entry point.

| Module  | Test Scenario                                           | Status    |
| ------- | ------------------------------------------------------- | --------- |
| Sign Up | Sign up from the **header** ("Get Started") entry point | Automated |
| Sign Up | Sign up from the **hero** ("Join Us Now") entry point   | Automated |
| Sign Up | Sign up from the **bottom** ("Join Us Now") entry point | Automated |

**Flow covered in each scenario**

1. Open the sign-up page from the entry point, accept the policy and continue
2. Enter user details
3. Enter the one-time verification code
4. Enter agency details
5. Enter experience details
6. Enter business details and upload the PDF
7. Verify the user lands on the dashboard (`/admin`)
8. Open the profile page (`/admin/profile`) and verify:
   - **Personal information:** first name, last name, phone number and email
   - **Agency details:** name, role, email, website, address and region of operation
   - **Lead form URL:** the generated `/inquiry/` link is visible
   - **Documents:** the uploaded PDF is listed. The application renames uploaded files by adding a random suffix (for example `sample-file_1q2jwRj.pdf`), so the test matches the file name and extension rather than the exact original name.

## Test Reports

By default, Cucumber prints the results in the terminal. To generate a report file in a `reports/` folder, add a format option when running:

```bash
# HTML report
npx cucumber-js e2e/features/signUp.feature \
  --require-module ts-node/register \
  --require "e2e/stepDefinitions/**/*.ts" \
  --require cucumber.conf.js \
  --format html:reports/cucumber-report.html

# JSON report
# --format json:reports/cucumber-report.json
```

In CI, the `reports/` folder is uploaded as the `cucumber-report` artifact (kept for 14 days). Screenshots and videos for failed tests are not configured.

## CI/CD Integration

- **Platform:** GitHub Actions (`.github/workflows/ci.yml`)
- **Triggers:** push to `main`, pull request to `main`, and manual dispatch
- **Jobs:**
  1. **Type check** – runs `npm run typecheck` on every trigger.
  2. **E2E tests** – runs after the type check on pushes to `main` and manual dispatch only (not on pull requests). Runs are serialized so they do not execute in parallel against the same production site.
- **Environment:** Ubuntu, Node 22, Playwright Chromium (cached), `CI=true` (headless)
- **Reporting:** the run summary shows the status, and the `reports/` folder is uploaded as an artifact.

Add these **repository secrets** in GitHub (Settings → Secrets and variables → Actions) using your personal Testmail credentials:

- `TESTMAIL_API_KEY`
- `TESTMAIL_NAMESPACE`

## Troubleshooting

| Problem                                        | Likely cause / fix                                                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `testmail 401` / `403` error                   | `TESTMAIL_API_KEY` or `TESTMAIL_NAMESPACE` is missing or wrong. Re-copy them from your Testmail console.                                   |
| `No email received`                            | The OTP email did not arrive within 60 seconds. Re-run and check the Testmail console.                                                     |
| `OTP not found`                                | The email format changed and no 6-digit code was found in the body.                                                                        |
| Documents check fails on the profile page      | The app adds a random suffix to uploaded file names. Make sure the check matches the name and extension (not the exact `sample-file.pdf`). |
| Browser installation issues                    | Run `npx playwright install --with-deps chromium`.                                                                                         |
| Dependency issues                              | Delete `node_modules` and run `npm ci` again.                                                                                              |
| File upload fails                              | Ensure `sample-file-upload/sample-file.pdf` exists and tests are run from the project root.                                                |
| Environment configuration issues               | Confirm the `.env` file is in the project root and both variables are set.                                                                 |
| Cucumber "Share your report" box in the output | Harmless message. To hide it, create a `cucumber.js` file with `module.exports = { default: '--publish-quiet' }`.                          |

## Author

**Madhavi Paudel**

- GitHub: [Madhavi0207](https://github.com/Madhavi0207)
- LinkedIn: [Madhavi Paudel](https://www.linkedin.com/in/madhavi-paudel-4956a12b3/)

## Demo Video

**Watch the demo:** (https://github.com/Madhavi0207/Vrit_QA_takeawayTask/issues/2#issue-6621730502)

_Make sure the link is set to "Anyone with the link can view"._

Suggested contents: project structure overview, running `npm run test:e2e`, the browser walking through the sign-up flow, the OTP being picked up from Testmail, the profile page verification, and the passing result in the terminal.
