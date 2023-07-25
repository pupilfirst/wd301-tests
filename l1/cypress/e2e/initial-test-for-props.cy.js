let studentSubmissionUrl =
  Cypress.env("STUDENT_SUBMISSION_URL") || "http://localhost:5173";

if (studentSubmissionUrl.endsWith("/")) {
  studentSubmissionUrl = studentSubmissionUrl.slice(0, -1);
}

describe("When visiting the homepage,", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
  });

  it("the application should show `pending` and `done` lists of tasks ", () => {
    cy.contains("pending", { matchCase: false });
    cy.contains("done", { matchCase: false });
  });
});
