import { DataTable } from "@cucumber/cucumber";
import { Locator, Page, expect } from "playwright/test";
import path from "path";
import { TestmailHelper } from "../utilities/testmail";
import { generatePhoneNumber } from "../../phoneNumber/phoneNumber";

function containing(value: string): RegExp {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

export class SignUpPage {
  private readonly page: Page;
  public readonly baseUrl: string;

  //Get started with privacy terms and condition

  private readonly getStartedButton: Locator;
  private readonly heroJoinUsButton: Locator;
  private readonly bottomJoinUsButton: Locator;
  private readonly policyCheckBox: Locator;
  private readonly continueButton: Locator;

  //Set up your account
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly emailField: Locator;
  private readonly phoneNumber: Locator;
  private readonly passwordSelector: Locator;
  private readonly confirmPassword: Locator;
  private readonly nextButtonSelector: Locator;

  //one time code verification

  private readonly codeVerification: Locator;

  //agency details

  private readonly agencyName: Locator;
  private readonly agencyRole: Locator;
  private readonly agencyEmail: Locator;
  private readonly agencyWebsite: Locator;
  private readonly agencyAddress: Locator;
  private readonly regionOfOperation: Locator;
  private readonly nextSubmitButton: Locator;

  //Professional Experience

  private readonly yearsOfExperience: Locator;
  private readonly recuritedStudentNo: Locator;
  private readonly focusArea: Locator;
  private readonly successMetrics: Locator;
  private readonly experienceNextBtn: Locator;

  //Verification and Preferences

  private readonly businessRegistrationNum: Locator;
  private readonly preferredCountries: Locator;
  private readonly certificationDetails: Locator;
  private readonly uploadFile: Locator;
  private readonly submitButton: Locator;

  // navigation to profile page
  public readonly dashboardPage: Locator;

  // Test data (fresh email address generated for every run)
  testEmail = TestmailHelper.generateEmail();
  private readonly startedAt = Date.now();
  phone = generatePhoneNumber();

  // Values entered during sign-up, kept so they can be verified on the profile page
  private enteredUser?: Record<string, string>;
  private enteredAgency?: Record<string, string>;
  private uploadedFileName?: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = "https://authorized-partner.vercel.app/";

    // Get started with policy terms and condition

    this.getStartedButton = this.page.getByRole("link", {
      name: "Get Started",
    });
    // "Join Us Now" in the hero section: solid primary-coloured button
    this.heroJoinUsButton = this.page
      .locator("button.bg-primary")
      .filter({ hasText: "Join Us Now" })
      .first();
    // "Join Us Now" in the bottom call-to-action: white button with a link icon
    this.bottomJoinUsButton = this.page
      .locator("button.bg-white")
      .filter({ has: this.page.locator("svg.lucide-link") })
      .filter({ hasText: "Join Us Now" })
      .first();
    this.policyCheckBox = this.page.locator('button[role="checkbox"]');

    this.continueButton = this.page.getByRole("button", { name: "Continue" });

    // Set up your account

    this.firstName = this.page.getByRole("textbox", { name: "First Name" });
    this.lastName = this.page.getByRole("textbox", { name: "Last Name" });
    this.emailField = this.page.getByRole("textbox", { name: "Email Address" });
    this.phoneNumber = this.page.getByRole("textbox", { name: "Phone Number" });
    this.passwordSelector = this.page.locator('input[name="password"]');
    this.confirmPassword = this.page.locator('input[name="confirmPassword"]');
    this.nextButtonSelector = this.page.getByRole("button", { name: "Next" });

    // One time code verification

    this.codeVerification = this.page.locator(
      'input[autocomplete="one-time-code"]',
    );

    //Agency Details

    this.agencyName = this.page.getByPlaceholder("Enter Agency Name");
    this.agencyRole = this.page.getByRole("textbox", {
      name: "Role in Agency",
    });
    this.agencyEmail = this.page.locator('input[name="agency_email"]');
    this.agencyWebsite = this.page.getByRole("textbox", { name: "Website" });
    this.agencyAddress = this.page.locator('input[name="agency_address"]');
    this.regionOfOperation = this.page.locator(
      "text=Select Your Region of Operation",
    );
    this.nextSubmitButton = this.page.getByRole("button", {
      name: "Next",
    });

    //Professional Details

    this.yearsOfExperience = this.page.getByRole("combobox", {
      name: "Years of Experience",
    });
    this.recuritedStudentNo = this.page.getByRole("spinbutton", {
      name: "Number of Students Recruited Annually",
    });
    this.focusArea = this.page.getByRole("textbox", { name: "Focus Area" });
    this.successMetrics = this.page.getByRole("spinbutton", {
      name: "Success Metrics",
    });
    this.experienceNextBtn = this.page.locator("button[type='submit']");

    // Business Details and Preferences

    this.businessRegistrationNum = this.page.getByRole("textbox", {
      name: "Business Registration Number",
    });
    this.preferredCountries = this.page.getByRole("combobox", {
      name: "Preferred Countries",
    });
    this.certificationDetails = this.page.getByRole("textbox", {
      name: "Certification Details (Optional)",
    });
    this.uploadFile = this.page
      .locator('[class*="flex"] svg.h-8.w-8.text-primary')
      .nth(0);
    this.submitButton = this.page.getByRole("button", { name: "Submit" });

    // Dashboard navigation: on the logged-in area the logo links to /admin
    // (on the public pages it links to "/")

    this.dashboardPage = this.page
      .locator('a[href="/admin"] img[alt="Logo"]')
      .first();
  }

  // Locators that depend on values from the feature file's data tables

  private regionOption(region: string): Locator {
    return this.page.locator(`div[role="dialog"] span:text-is("${region}")`);
  }

  private experienceOption(years: string): Locator {
    return this.page.locator('[role="option"]').filter({ hasText: years });
  }

  private countryOption(country: string): Locator {
    return this.page.getByRole("dialog").filter({ hasText: country });
  }

  private institutionCheckbox(institution: string): Locator {
    return this.page.getByRole("checkbox", { name: institution });
  }

  private serviceCheckbox(service: string): Locator {
    return this.page.getByRole("checkbox", { name: service });
  }

  // The sign up page can be opened from three places on the landing page:
  //   header -> "Get Started" link (default)
  //   hero   -> "Join Us Now" button in the hero section
  //   bottom -> "Join Us Now" button (with link icon) in the bottom call-to-action
  private entryButton(entryPoint: string): Locator {
    switch (entryPoint.trim().toLowerCase()) {
      case "header":
        return this.getStartedButton;
      case "hero":
        return this.heroJoinUsButton;
      case "bottom":
        return this.bottomJoinUsButton;
      default:
        throw new Error(
          `Unknown sign up entry point "${entryPoint}". Use "header", "hero" or "bottom".`,
        );
    }
  }

  async navigateToLandingPage(entryPoint: string = "header"): Promise<void> {
    await this.page.goto(this.baseUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.entryButton(entryPoint).click();
    await this.page.waitForURL(/\/register/);
    await this.policyCheckBox.click();
    await this.continueButton.click();
  }

  async enterUserDetails(dataTable: DataTable): Promise<void> {
    const user = dataTable.hashes()[0];
    this.enteredUser = user;

    await this.firstName.fill(user.firstname);
    await this.lastName.fill(user.lastName);
    await this.emailField.fill(this.testEmail);
    await this.phoneNumber.fill(this.phone);
    await this.passwordSelector.fill(user.password);
    await this.confirmPassword.fill(user.confirmPassword);

    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.nextButtonSelector.click(),
    ]);
  }

  async oneTimeCodeVerification(): Promise<void> {
    const otp = await TestmailHelper.getOTP(this.startedAt);
    await this.codeVerification.fill(otp);
    await this.page.keyboard.press("Enter");
  }

  async enterAgencyDetails(dataTable: DataTable): Promise<void> {
    const agency = dataTable.hashes()[0];
    this.enteredAgency = agency;

    await this.agencyName.fill(agency.agencyName);
    await this.agencyRole.fill(agency.Role);
    await this.agencyEmail.fill(agency.agencyEmail);
    await this.agencyWebsite.fill(agency.website);
    await this.agencyAddress.fill(agency.address);
    await this.regionOfOperation.click();
    await this.regionOption(agency.regionOfOperation).click();
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.nextSubmitButton.click(),
    ]);
  }

  async enterExperienceDetails(dataTable: DataTable): Promise<void> {
    const exp = dataTable.hashes()[0];

    await this.yearsOfExperience.click();
    await this.experienceOption(exp.yearsOfExperience).click();
    await this.recuritedStudentNo.fill(exp.numberOfStudents);
    await this.focusArea.fill(exp.focusArea);
    await this.successMetrics.fill(exp.successMetrics);
    await this.serviceCheckbox(exp.serviceProvided).click();
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.experienceNextBtn.click(),
    ]);
  }

  async enterBusinessDetails(dataTable: DataTable): Promise<void> {
    const filePath = path.resolve(
      process.cwd(),
      "sample-file-upload/sample-file.pdf",
    );
    const biz = dataTable.hashes()[0];
    this.uploadedFileName = path.basename(filePath);

    await this.businessRegistrationNum.fill(biz.RegistrationNum);
    await this.preferredCountries.click();
    await this.countryOption(biz.PreferredCountry).click();
    await this.institutionCheckbox(biz.PreferredInstitution).click();
    await this.certificationDetails.fill(biz.certificationDetails);
    await this.uploadFile.click();
    await this.page.setInputFiles('input[type="file"]', filePath);
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.submitButton.click(),
    ]);
  }

  async verifyDashboardLoaded(): Promise<void> {
    // The registration flow ends in the logged-in /admin area...
    await expect(this.page).toHaveURL(/\/admin/, { timeout: 30000 });
    // ...where the logo links to /admin (public pages link to "/")
    await expect(this.dashboardPage).toBeVisible({ timeout: 30000 });
  }

  private profileCard(title: string): Locator {
    return this.page.locator("div.border.rounded-lg", {
      has: this.page.getByRole("heading", { name: title }),
    });
  }

  private profileField(card: Locator, label: string): Locator {
    return card.locator("div.flex-col.gap-3", {
      has: this.page.getByText(label, { exact: true }),
    });
  }

  async verifyProfileDetails(): Promise<void> {
    const user = this.enteredUser;
    const agency = this.enteredAgency;
    if (!user || !agency || !this.uploadedFileName) {
      throw new Error(
        "Sign-up details were not captured. Run the sign-up steps first.",
      );
    }

    await this.page.goto(`${this.baseUrl}admin/profile`, {
      waitUntil: "domcontentloaded",
    });
    await expect(this.page).toHaveURL(/\/admin\/profile/);

    // Personal information (the phone number is shown with a +977 prefix)
    const personal = this.profileCard("Personal Information");
    await expect(this.profileField(personal, "First Name")).toContainText(
      containing(user.firstname),
    );
    await expect(this.profileField(personal, "Last Name")).toContainText(
      containing(user.lastName),
    );
    await expect(this.profileField(personal, "Phone Number")).toContainText(
      this.phone,
    );
    await expect(this.profileField(personal, "Email")).toContainText(
      containing(this.testEmail),
    );

    // Agency details
    const agencyCard = this.profileCard("Agency Details");
    await expect(this.profileField(agencyCard, "Agency Name")).toContainText(
      containing(agency.agencyName),
    );
    await expect(this.profileField(agencyCard, "Role In Agency")).toContainText(
      containing(agency.Role),
    );
    await expect(this.profileField(agencyCard, "Email")).toContainText(
      containing(agency.agencyEmail),
    );
    await expect(this.profileField(agencyCard, "Website")).toContainText(
      containing(agency.website),
    );
    await expect(this.profileField(agencyCard, "Address")).toContainText(
      containing(agency.address),
    );
    await expect(
      this.profileField(agencyCard, "Region of Operation"),
    ).toContainText(containing(agency.regionOfOperation));

    // Lead form URL generated for the agency
    await expect(this.page.getByText(/\/inquiry\//).first()).toBeVisible();

    // Uploaded document
    await expect(this.profileCard("Documents")).toContainText(
      this.uploadedFileName,
    );
  }
}
