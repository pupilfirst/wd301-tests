let studentSubmissionUrl =
  Cypress.env("STUDENT_SUBMISSION_URL") || "http://localhost:3000";

if (studentSubmissionUrl.endsWith("/")) {
  studentSubmissionUrl = studentSubmissionUrl.slice(0, -1);
}

describe("When signing up,", () => {
  it("the form should accept `#organisationName`, `#userName`, `#userEmail`, `#userPassword`, and have a submit button", () => {
    cy.visit(studentSubmissionUrl + "/signup");
    cy.get("#organisationName").clear();
    cy.get("#organisationName").type("ACME Corp");
    cy.get("#userName").clear();
    cy.get("#userName").type("Alice");
    cy.get("#userEmail").clear();
    cy.get("#userEmail").type("alice@acme.com");
    cy.get("#userPassword").clear();
    cy.get("#userPassword").type("12345678");
    cy.get("button[type='submit']").click();
  });
});

describe("After signing in,", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl + "/signin");
    cy.get("#email").clear();
    cy.get("#email").type("alice@acme.com");
    cy.get("#password").clear();
    cy.get("#password").type("12345678");
    cy.get("button[type='submit']").click();
  });

  it("the user should be redirected to the `/dashboard` path", () => {
    cy.location("pathname").should("equal", "/dashboard");
  });

  it("the user should be shown their name and email in dashboard", () => {
    cy.contains("alice@acme.com", { matchCase: false });
    cy.contains("Alice", { matchCase: false });
  });

  it("the user should be on a page with a `#logout-link`, which when clicked, takes the user to the `/signin` path", () => {
    cy.get("#logout-link").should("exist");
    cy.get("#logout-link").click();
    cy.location("pathname").should("equal", "/signin");
  });
});

describe("When signed out,", () => {
  it("someone trying to access the `/dashboard` path should be redirected to the `/signin` path", () => {
    cy.visit(studentSubmissionUrl + "/dashboard");
    cy.location("pathname").should("equal", "/signin");
  });
});
