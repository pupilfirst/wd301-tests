/// <reference types="cypress" />

import * as keyCodes from "./key-codes";
import { getDroppableSelector, getDraggableSelector } from "./utils";
let studentSubmissionUrl =
  Cypress.env("STUDENT_SUBMISSION_URL") || "http://localhost:3000";
if (studentSubmissionUrl.endsWith("/")) {
  studentSubmissionUrl = studentSubmissionUrl.slice(0, -1);
}

describe("Preparing for Level 8 milestone testing, first we will signup", () => {
  it("should visit signup path and create an account", () => {
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

const projectName = Math.random().toString(36).substring(2, 7);
const taskTitle = Math.random().toString(36).substring(2, 7);
const taskDescription = Math.random().toString(36).substring(2, 30);
describe("After signing in,", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl + "/signin");
    cy.get("#email").clear();
    cy.get("#email").type("alice@acme.com");
    cy.get("#password").clear();
    cy.get("#password").type("12345678");
    cy.get("button[type='submit']").click();
    cy.wait(800);
  });

  it("the project page should contain a button with id `newProjectBtn`", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.get("#newProjectBtn").should("exist");
  });

  it("new project page should contain an input field with `name` attribute as `name`, the submit button should have id `submitNewProjectBtn`", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.get("#newProjectBtn").click();

    cy.get('input[name="name"]').should("exist");
    cy.get("#submitNewProjectBtn").should("exist");
  });
  
  it("the user should be able to create a project", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.get("#newProjectBtn").click();

    cy.get('input[name="name"]').type(projectName);
    cy.get("#submitNewProjectBtn").click();
  });

  it("new task page should contain input fields with name attributes `title`, `description`, `dueDate`", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();
    cy.get("#newTaskBtn").click();

    cy.get('input[name="title"]').should("exist");
    cy.get('input[name="description"]').should("exist");
    cy.get('input[name="dueDate"]').should("exist");
    cy.get("#newTaskSubmitBtn").should("exist");
  });
  
  it("the user should be able to create a task", () => {

    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();
    cy.get("#newTaskBtn").click();
    cy.get('input[name="title"]').type(taskTitle);
    cy.get('input[name="description"]').type(taskDescription);
    cy.get('input[name="dueDate"]').type("2023-05-10");
    cy.get("#newTaskSubmitBtn").click();
    cy.wait(500);
  });
  it("the user should be able to drag a task from pending to in_progress", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();

    cy.wait(500);
    cy.get(getDroppableSelector())
      .eq(0)
      .as("first-list")
      .should("contain", taskTitle);

    cy.get(getDroppableSelector())
      .eq(1)
      .as("second-list")
      .should("not.contain", taskTitle);

    cy.get("@first-list")
      .find(getDraggableSelector())
      .first()
      .should("contain", taskTitle)
      .focus()
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowRight, force: true })
      .wait(500)
      .trigger("keydown", { keyCode: keyCodes.space, force: true });
    cy.wait(2000);
    cy.get("@first-list").should("not.contain", taskTitle);
    cy.get("@second-list").should("contain", taskTitle);
  });

  it("the user should be able to drag a task from in_progress to done", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();

    cy.wait(500);
    cy.get(getDroppableSelector())
      .eq(1)
      .as("first-list")
      .should("contain", taskTitle);
    cy.get(getDroppableSelector())
      .eq(2)
      .as("second-list")
      .should("not.contain", taskTitle);

    cy.get("@first-list")
      .find(getDraggableSelector())
      .first()
      .should("contain", taskTitle)
      .focus()
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowRight, force: true })
      .wait(500)
      .trigger("keydown", { keyCode: keyCodes.space, force: true });
    cy.wait(2000);

    cy.get("@first-list").should("not.contain", taskTitle);
    cy.get("@second-list").should("contain", taskTitle);
  });

  it("the user should view task details when clicked on a task", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();

    cy.wait(500);
    cy.get(getDroppableSelector())
      .eq(2)
      .as("second-list")
      .should("contain", taskTitle);

    cy.get("@second-list").find(getDraggableSelector()).click();
    cy.location("pathname").should(
      "match",
      new RegExp("^/account/projects/\\d+/tasks/\\d+$")
    );
  });

  it("the task details page should contain an input field with id `commentBox` and a button with id `addCommentBtn`", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();

    cy.wait(500);
    cy.get(getDroppableSelector())
      .eq(2)
      .as("second-list")
      .should("contain", taskTitle);

    cy.get("@second-list").find(getDraggableSelector()).click();
    cy.location("pathname").should(
      "match",
      new RegExp("^/account/projects/\\d+/tasks/\\d+$")
    );
    cy.get("#commentBox").should("exist");
    cy.get("#addCommentBtn").should("exist");
  });

  it("the user should be able to add comment and see them in chronologically reverse order", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();

    cy.wait(500);
    cy.get(getDroppableSelector())
      .eq(2)
      .as("second-list")
      .should("contain", taskTitle);

    cy.get("@second-list").find(getDraggableSelector()).click();
    cy.location("pathname").should(
      "match",
      new RegExp("^/account/projects/\\d+/tasks/\\d+$")
    );
    cy.get("#commentBox").type("First comment");
    cy.get("#addCommentBtn").click();

    cy.get("#commentBox").clear();
    cy.get("#commentBox").type("Latest comment");
    cy.get("#addCommentBtn").click();

    //  Verify ordering
    cy.get(".comment").eq(0).should("contain", "Latest comment");
    cy.get(".comment").eq(1).should("contain", "First comment");

    // Verify owner name is present
    cy.get(".comment").eq(0).should("contain", "Alice");
  });

  it("the user should be able to delete a task", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");
    cy.contains(projectName, { matchCase: false }).click();

    cy.wait(500);
    cy.get(getDroppableSelector())
      .eq(2)
      .as("second-list")
      .should("contain", taskTitle);

    cy.get(".deleteTaskButton").first().click();
    cy.wait(500);
    cy.get(getDroppableSelector())
      .eq(2)
      .as("second-list")
      .should("not.contain", taskTitle);
  });
});
