/// <reference types="cypress" />

const todoItems = [
  {
    title: "Sample item 1",
    description: "item 1 description",
    dueDate: "2023-01-09",
  },
  {
    title: "Sample item 2",
    description: "item 2 description",
    dueDate: "2023-01-09",
  },
  {
    title: "Sample item 3",
    description: "item 3 description",
    dueDate: "2023-01-09",
  },
];

const addEntries = () => {
  todoItems.forEach((item) => {
    cy.get("#todoDueDate").type(`${item.dueDate}`);
    cy.get("#todoTitle").type(`${item.title}`);
    cy.get("#todoDescription").type(`${item.description}`);
    cy.get("#addTaskButton").click();
  });
};

let studentSubmissionUrl = Cypress.env("STUDENT_SUBMISSION_URL");
if (studentSubmissionUrl.endsWith("/")) {
  studentSubmissionUrl = studentSubmissionUrl.slice(0, -1);
}

describe("After signing in,", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
    cy.get("#username").clear();
    cy.get("#username").type("admin");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get("button[type='submit']").click();
  });

  it("the page should have a `<nav>` element", () => {
    cy.get("nav").should("be.visible");
  });

  it("the page should have one (and only one) level one heading element", () => {
    cy.get("h1").should("have.length", 1);
  });
});

describe("After signing in and visiting the `/tasks` page,", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
    cy.get("#username").clear();
    cy.get("#username").type("admin");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get("button[type='submit']").click();
    cy.visit(studentSubmissionUrl + "/tasks");
  });

  it("new `.TaskItem` elements should appear when adding items by filling in `#todoDueDate`, `#todoTitle`, `#todoDescription`,  and then clicking the `#addTaskButton`", () => {
    addEntries();
    cy.get(".TaskItem").should("have.length", todoItems.length);
  });

  it("the user should not be able to add items with necessary fields missing", () => {
    const todoItems = [
      {
        title: "Sample item 1",
        description: "item 1 description",
        dueDate: "2023-01-09",
      },
    ];

    todoItems.forEach((item) => {
      cy.get("#todoTitle").type(`${item.title}`);
      cy.get("#addTaskButton").click();
    });

    cy.get("#todoTitle").clear();

    todoItems.forEach((item) => {
      cy.get("#todoDueDate").type(`${item.dueDate}`);
      cy.get("#todoDescription").type(`${item.description}`);
      cy.get("#addTaskButton").click();
    });

    cy.get(".TaskItem").should("have.length", 0);
  });

  it("reloading the page after adding some items should still show the items on the page", () => {
    addEntries();
    cy.reload();
    cy.get(".TaskItem").should("have.length", todoItems.length);
  });

  it("deleting a few added items should reduce the number of `.TaskItem` elements on the page", () => {
    addEntries();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".TaskItem").should("have.length", todoItems.length - 2);
  });
});

describe("Level 5 milestone task details Page", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
    cy.get("#username").clear();
    cy.get("#username").type("admin");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get("button[type='submit']").click();
    cy.visit(studentSubmissionUrl + "/tasks");
  });
  it("should click and lead to task details page", () => {
    addEntries();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".text-base").click();
    cy.get("h3").should("be.visible");
  });
  it("should click on item 1 and lead to task details page", () => {
    addEntries();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".text-base").should("have.text", "Sample item 1");
  });
  it("should have the right task details", () => {
    addEntries();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".deleteTaskButton").last().click();
    cy.get(".text-base").click();
    cy.get("h3").should("have.text", "Sample item 1");
  });
});

describe("Level 5 milestone should validate protected route", () => {
  it("while visiting Homepage and redirect to sign-in page when unauthenticated", () => {
    cy.visit(studentSubmissionUrl);
    cy.location("pathname").should("equal", "/signin"); // Verify that we are redirected to the sign-in page
  });

  it("while visiting Tasks page and redirect to sign-in page when unauthenticated", () => {
    cy.visit(studentSubmissionUrl + "/tasks");
    cy.location("pathname").should("equal", "/signin"); // Verify that we are redirected to the sign-in page
  });
});

describe("Level 5 milestone should validate protected route after signin", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
    cy.get("#username").clear();
    cy.get("#username").type("admin");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get("button[type='submit']").click();
  });

  it("and redirect to Home page when authenticated", () => {
    cy.get("nav").should("be.visible");
  });

  it("and redirect to Signin page when clicked on Signout", () => {
    cy.visit(studentSubmissionUrl + "/signin");
    cy.visit(studentSubmissionUrl);
    cy.location("pathname").should("equal", "/signin");
  });
});

describe("Level 5 milestone should validate undefined route", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
    cy.get("#username").clear();
    cy.get("#username").type("admin");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get("button[type='submit']").click();
  });

  it("and redirect to NotFound page on invalid path", () => {
    cy.visit(studentSubmissionUrl + "/test");
    cy.location("pathname").should("equal", "/notfound");
  });

  it("and hide the Header in NotFound page", () => {
    cy.visit(studentSubmissionUrl + "/test");
    cy.get("nav").should("have.length", 0);
  });
});
