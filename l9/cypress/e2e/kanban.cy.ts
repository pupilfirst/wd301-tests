/// <reference types="cypress" />

import * as keyCodes from "./key-codes";
import { getDroppableSelector, getDraggableSelector } from "./utils";

let studentSubmissionUrl =
  Cypress.env("STUDENT_SUBMISSION_URL") || "http://localhost:5173";

if (studentSubmissionUrl.endsWith("/")) {
  studentSubmissionUrl = studentSubmissionUrl.slice(0, -1);
}

describe("When signed out,", () => {
  it("users should be able to visit `/signup` and fill in `#organisationName`, `#userName`, `#userEmail`, `#userPassword`, and click the `submit` button", () => {
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

  it("visiting the `/account/projects` path should render a Progressive Web App that uses a proper service worker", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");

    // Wait for service worker to get activated.
    cy.wait(3000);

    cy.window().then((window) => {
      if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
      expect(window.navigator.serviceWorker.controller).to.not.be.null;
    });
  });

  it("visiting the `/account/projects` path should also use a proper Manifest file", () => {
    cy.visit(studentSubmissionUrl + "/account/projects");

    // Verify if the web page has a manifest file
    cy.document().then((document) => {
      const manifest = document.querySelector('link[rel="manifest"]');
      expect(manifest).to.exist;
    });
  });
});

describe("After signing in, and navigating to the ", () => {
  beforeEach(() => {
    cy.visit(studentSubmissionUrl + "/signin");
    cy.get("#email").clear();
    cy.get("#email").type("alice@acme.com");
    cy.get("#password").clear();
    cy.get("#password").type("12345678");
    cy.get("button[type='submit']").click();
    cy.wait(800);
  });

  it("`/account/projects` path, the `ProjectList` component should have suspense implemented, rendering a `div` with class `suspense-loading`", () => {
    cy.intercept("GET", "http://localhost:3001/projects", (req) => {
      cy.wait(2000);
    }).as("getProjects");

    cy.visit(studentSubmissionUrl + "/account/projects");

    cy.get(".suspense-loading").should("be.visible");
  });

  it("`/account/members` path, the `MemberList` component should have suspense implemented rendering a `div` with class `suspense-loading`", () => {
    cy.intercept("GET", "http://localhost:3001/users", (req) => {
      cy.wait(2000);
    }).as("getUsers");

    cy.visit(studentSubmissionUrl + "/account/members");

    cy.get(".suspense-loading").should("be.visible");
  });
});
