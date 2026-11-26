Feature: Sign Up
  As a user
  I want to sign up into the website
  So that I can use the website

  Scenario Outline: Sign up from the <entryPoint> entry point
    Given The user opens the sign up page from the "<entryPoint>" entry point

    When The user enters the given details for user details:
      | firstname | lastName | password   | confirmPassword |
      | Madhavi   | Paudel   | Hellow@123 | Hellow@123      |

    And the user enters one time verification code

    And The user enters the agency details:
      | agencyName  | Role    | agencyEmail             | website         | address | regionOfOperation |
      | KanyaCampus | Student | info@kanyacampus.edu.np | kanyacampus.com | Pokhara | Nepal             |

    And The user enters experience details:
      | yearsOfExperience | numberOfStudents | focusArea  | successMetrics | serviceProvided   |
      | 10+ years         | 300              | Management | 80             | Career Counseling |

    And The user enters following business details:
      | RegistrationNum | PreferredCountry | PreferredInstitution | certificationDetails |
      | 01234578        | Australia        | Universities         | hello this is test   |

    Then The user logs into the dashboard
    And The user sees the entered details on the profile page

    Examples:
      | entryPoint |
      | header     |
      | hero       |
      | bottom     |