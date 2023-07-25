let studentSubmissionUrl =
  Cypress.env("STUDENT_SUBMISSION_URL") || "http://localhost:3000";

if (studentSubmissionUrl.endsWith("/")) {
  studentSubmissionUrl = studentSubmissionUrl.slice(0, -1);
}

const signIn = () => {
  cy.visit(studentSubmissionUrl + "/signin");
  cy.get("#email").clear();
  cy.get("#email").type("alice@acme.com");
  cy.get("#password").clear();
  cy.get("#password").type("12345678");
  cy.get("button[type='submit']").click();
};

describe("When signed out,", () => {
  it("visiting the `/signup` path should allow users to sign up by filling in `#organisationName`, `#userName`, `#userEmail`, `#userPassword`, and clicking the submit button", () => {
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

  it("visiting `/signin` and filling in `#email`, `#password` and clicking the submit button, the user should be redirected to `/account/projects`", () => {
    signIn();

    cy.location("pathname").should("equal", "/account/projects");
  });
});

describe("After signing in", () => {
  beforeEach(signIn);

  it("visiting the `/account/members` page should show the signed in user's email address and name", () => {
    cy.visit(studentSubmissionUrl + "/account/members");
    cy.contains("alice@acme.com", { matchCase: false });
    cy.contains("Alice", { matchCase: false });
  });

  it("visiting `/account/members` and clicking `#new-member-btn` should allow users to fill in `#name`, `#email`, `#password`, and clicking `#create-member-btn` should add the new user's email address and name in the list of members", () => {
    cy.visit(studentSubmissionUrl + "/account/members");

    cy.get("#new-member-btn").click();

    let x = Math.floor(Math.random() * 10000 + 1);

    cy.get("#name").clear();
    cy.get("#name").type(`Alice ${x}`);
    cy.get("#email").clear();
    cy.get("#email").type(`alice${x}@yopmail.com`);
    cy.get("#password").clear();
    cy.get("#password").type("12345678");
    cy.get("#create-member-btn").click();

    cy.contains(`alice${x}@yopmail.com`, { matchCase: false });
    cy.contains(`Alice ${x}`, { matchCase: false });
  });

  it("visiting the `/account/members` page should show a delete button that can be clicked", () => {
    cy.visit(studentSubmissionUrl + "/account/members");

    cy.get(".member") // Select all cards with classname ".member"
      .last() // Select the last card
      .within(() => {
        cy.get("button") // Select the button within the last card
          .click(); // Perform an action on the button (e.g., click)
      });
  });
});
