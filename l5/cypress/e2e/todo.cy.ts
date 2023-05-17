/// <reference types="cypress" />

const todoItems = [
  {
    title: "Sample item 1",
    description: "item 1 description",
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

describe("After signing in with the username `admin`, and password `admin`,", () => {
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

  it("clicking on the task title should navigate to task details page", () => {
    addEntries();
    cy.get(".text-base").click();
    cy.get("h3").should("be.visible");
  });

  it("clicking on the task title should navigate to task details page with the same title rendered in a `<h3>` heading element", () => {
    addEntries();
    cy.get(".text-base").click();
    cy.get("h3").should("have.text", "Sample item 1");
  });
});

describe("With protected routes implemented and while the user is not signed in,", () => {
  it("visiting the homepage should redirect back to the `/signin` page", () => {
    cy.visit(studentSubmissionUrl);
    cy.location("pathname").should("equal", "/signin");
  });

  it("visiting the `/tasks` page should redirect back to the `/signin` page", () => {
    cy.visit(studentSubmissionUrl + "/tasks");
    cy.location("pathname").should("equal", "/signin");
  });
});

describe("With protected routes implemented and the user signed in,", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
    cy.get("#username").clear();
    cy.get("#username").type("admin");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get("button[type='submit']").click();
  });

  it("the application should redirect to the homepage and the `<nav>` element should be visible", () => {
    cy.get("nav").should("be.visible");
  });
});

describe("With protected routes implemented and while the user signs in with the username `admin` and password `admin`,", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl);
    cy.get("#username").clear();
    cy.get("#username").type("admin");
    cy.get("#password").clear();
    cy.get("#password").type("admin");
    cy.get("button[type='submit']").click();
  });

  it("the application redirects to the `/notfound` page on visting an invalid path", () => {
    cy.visit(studentSubmissionUrl + "/test");
    cy.location("pathname").should("equal", "/notfound");
  });

  it("the application does not contain the `<nav>` element on the `/notfound` page", () => {
    cy.visit(studentSubmissionUrl + "/test");
    cy.get("nav").should("have.length", 0);
  });

  it("the application redirects back to the Home page from the `/notfound` page while clicking on the `#backToHomeButton`", () => {
    cy.visit(studentSubmissionUrl + "/test");
    cy.get("#backToHomeButton").click();
    cy.location("pathname").should("equal", "/");
  });
});
