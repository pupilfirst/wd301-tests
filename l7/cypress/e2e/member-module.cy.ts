let studentSubmissionUrl = Cypress.env("STUDENT_SUBMISSION_URL") || "http://localhost:3000";
if (studentSubmissionUrl.endsWith("/")) {
  studentSubmissionUrl = studentSubmissionUrl.slice(0, -1);
}

describe("Preparing Level 7 milestone test suite to validate members page, signin form and signup form", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl + "/signin");
    cy.get("#email").clear();
    cy.get("#email").type("alice@acme.com");
    cy.get("#password").clear();
    cy.get("#password").type("12345678");
    cy.get("button[type='submit']").click();
  });

  it("should visit members page and find a member alice", () => {
    cy.location("pathname").should("equal", "/account/projects");
    cy.visit(studentSubmissionUrl + "/account/members");
    cy.contains("alice@acme.com", { matchCase: false })
    cy.contains("Alice", { matchCase: false })
  })

  it("should visit members page and create a new member", () => {
    cy.location("pathname").should("equal", "/account/projects");
    cy.visit(studentSubmissionUrl + "/account/members");
    cy.get("#new-member-btn").click();

    let x = Math.floor((Math.random() * 10000) + 1);

    cy.get("#name").clear();
    cy.get("#name").type(`Alice ${x}`);
    cy.get("#email").clear();
    cy.get("#email").type(`alice${x}@yopmail.com`);
    cy.get("#password").clear();
    cy.get("#password").type("12345678");
    cy.get("#create-member-btn").click();

    cy.contains(`alice${x}@yopmail.com`, { matchCase: false })
    cy.contains(`Alice ${x}`, { matchCase: false })
  })

  it("should visit members page and delete the newly created member", () => {
    cy.location("pathname").should("equal", "/account/projects");
    cy.visit(studentSubmissionUrl + "/account/members");

    cy.get('.member')  // Select all cards with classname ".member"
    .last()          // Select the last card
    .within(() => {
      cy.get('button')  // Select the button within the last card
        .click();      // Perform an action on the button (e.g., click)
    });    
  })
});
