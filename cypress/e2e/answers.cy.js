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

describe("Login", () => {
  it("should login successfully", () => {
    // Visit the login page
    cy.visit("http://localhost:3000/login");
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').clear();
    // Fill in the login form and submit
    cy.get('input[name="username"]').type("hetan");
    cy.get('input[name="password"]').type("hetan");
    cy.get('button[type="submit"]').click();

    // Assert that the user is redirected to the FakeStackOverflow component
    cy.url().should("eq", "http://localhost:3000/");
  });
});

describe("Answer Page 1", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Answer Page displays expected header", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.get("#answersHeader").should(
      "contain",
      "Programmatically navigate using React router"
    );
    cy.get("#answersHeader").should("contain", "2 answers");
    cy.get("#answersHeader").should("contain", "Ask a Question");
    cy.get("#sideBarNav").should("contain", "Questions");
    cy.get("#sideBarNav").should("contain", "Tags");
  });
});


// describe("Answer Page 2", () => {
//   beforeEach(() => {
//     performLogin();
//   });

//   it("Answer Page displays expected question text", () => {
//     const text =
//       "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.";

//     cy.contains("Programmatically navigate using React router").click();

//     // Wait for the #question-body-container element to appear
//     // cy.get("#question-body-container", { timeout: 10000 }).should("exist");

//     // Perform assertions
//     cy.get("#question-header").should("contain", "3 views");
//     cy.get("#question-body-container").should("contain", text);
//     cy.get("#question-body-container").should("contain", "Joji John");
//     cy.get("#question-body-container").should("contain", "Jan 20, 2022");
//     cy.get("#question-body-container").should("contain", "03:00:00");
//   });
// });


describe("Answer Page 2", () => {
  beforeEach(() => {
    performLogin();
  });

  it("Answer Page displays expected question text", () => {
    const text =
      "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.";

    cy.contains("Programmatically navigate using React router").click();

    // Wait for the question-body-container element to appear
    cy.get(".question-body-container").should("exist");

    // Perform assertions
    cy.get(".question-views").should("contain", "3 views");
    cy.get(".handlelink").should("contain", text);
    cy.get(".question-author").should("contain", "Joji John");
    cy.get(".question-meta").should("contain", "Jan 20, 2022 03:00:00");
  });
});



describe("Answer Page 3", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Answer Page displays expected answers", () => {
    const answers = [
      "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    ];
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.get(".answer-text").each(($el, index) => {
      cy.wrap($el).should("contain", answers[index]);
    });
  });
});
describe("Answer Page 4", () => {
  beforeEach(() => {
    performLogin();
  });

  it("Answer Page displays expected authors", () => {
    const authors = ["hamkalo", "azad"];
    const dates = ["Nov 20", "Nov 23"];
    const times = ["03:24:42", "08:24:00"];

    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Iterate over each answer
    cy.get(".answer-author-meta").each(($answer, index) => {
      const author = authors[index];
      const date = dates[index];
      const time = times[index];

      // Within each answer, find the author and meta elements
      cy.wrap($answer)
        .find(".answer-author")
        .should("contain", author);

      cy.wrap($answer)
        .find(".answer-meta")
        .should("contain", date)
        .should("contain", time);
    });
  });
});

