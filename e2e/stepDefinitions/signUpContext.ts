import { Given, When, Then, DataTable } from "@cucumber/cucumber";

import { CustomWorld } from "../support/CustomWorld";
import { SignUpPage } from "../pageObject/SignUpPage";

Given("The user is in the sign up page", async function (this: CustomWorld) {
  if (!this.signUpPage) {
    this.signUpPage = new SignUpPage(this.page);
  }

  await this.signUpPage.navigateToLandingPage();
});

Given(
  "The user opens the sign up page from the {string} entry point",
  async function (this: CustomWorld, entryPoint: string) {
    if (!this.signUpPage) {
      this.signUpPage = new SignUpPage(this.page);
    }

    await this.signUpPage.navigateToLandingPage(entryPoint);
  },
);

When(
  "The user enters the given details for user details:",
  async function (this: CustomWorld, dataTable: DataTable) {
    if (!this.signUpPage) {
      this.signUpPage = new SignUpPage(this.page);
    }
    await this.signUpPage.enterUserDetails(dataTable);
  },
);

When(
  "the user enters one time verification code",
  async function (this: CustomWorld) {
    if (!this.signUpPage) {
      this.signUpPage = new SignUpPage(this.page);
    }
    await this.signUpPage.oneTimeCodeVerification();
  },
);

When(
  "The user enters the agency details:",
  async function (this: CustomWorld, dataTable: DataTable) {
    if (!this.signUpPage) {
      this.signUpPage = new SignUpPage(this.page);
    }
    await this.signUpPage.enterAgencyDetails(dataTable);
  },
);

When(
  "The user enters experience details:",
  async function (this: CustomWorld, dataTable: DataTable) {
    if (!this.signUpPage) {
      this.signUpPage = new SignUpPage(this.page);
    }
    await this.signUpPage.enterExperienceDetails(dataTable);
  },
);

When(
  "The user enters following business details:",
  async function (this: CustomWorld, dataTable: DataTable) {
    if (!this.signUpPage) {
      this.signUpPage = new SignUpPage(this.page);
    }
    await this.signUpPage.enterBusinessDetails(dataTable);
  },
);

Then("The user logs into the dashboard", async function (this: CustomWorld) {
  if (!this.signUpPage) {
    this.signUpPage = new SignUpPage(this.page);
  }
  await this.signUpPage.verifyDashboardLoaded();
});

Then(
  "The user sees the entered details on the profile page",
  async function (this: CustomWorld) {
    if (!this.signUpPage) {
      this.signUpPage = new SignUpPage(this.page);
    }
    await this.signUpPage.verifyProfileDetails();
  },
);
