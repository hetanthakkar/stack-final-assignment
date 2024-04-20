const performLogin = () => {
  cy.visit("http://localhost:3000/login");
  cy.get('input[name="username"]').clear();
  cy.get('input[name="password"]').clear();
  // Fill in the login form and submit
  cy.get('input[name="username"]').type("hetan");
  cy.get('input[name="password"]').type("hetan");
  cy.get('button[type="submit"]').click();

  // Assert that the user is redirected to the FakeStackOverflow component
  cy.url().should("eq", "http://localhost:3000/");
};
describe("All Tags 1", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Total Tag Count", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.contains("All Tags");
    cy.contains("7 Tags");
    cy.contains("Ask a Question");
  });
});

describe("All Tags 2", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Tag names and count", () => {
    const tagNames = [
      "react",
      "javascript",
      "android-studio",
      "shared-preferences",
    ];
    const tagCounts = ["1 question", "2 questions", "1 question", "1 question"];
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.get(".tagNode").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames[index]);
      cy.wrap($el).should("contain", tagCounts[index]);
    });
  });
});

describe("All Tags 3", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Click Tag Name", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.contains("react").click();
    cy.contains("Programmatically navigate using React router");
    cy.contains("2 answers");
    cy.contains("3 views");
    cy.contains("Joji John");
    cy.contains("Jan 20");
    cy.contains("03:00");
  });
});
