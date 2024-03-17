describe("home page", () => {

  beforeEach(() => {

    cy.visit("/");

  });

  it("initial ==> viewer is empty", () => {

    cy.get("ionic-logging-viewer")
      .find("ion-item")
      .should("not.exist");

  });

  describe("log level INFO", () => {

    it("click info ==> viewer shows message", () => {

      cy.contains("ion-button", "INFO")
        .click();

      cy.get("ionic-logging-viewer")
        .find("ion-item")
        .its("length")
        .should("eq", 1);

    });

    it("click debug ==> viewer does not show message", () => {

      cy.contains("ion-button", "DEBUG")
        .click();

      cy.get("ionic-logging-viewer")
        .find("ion-item")
        .should("not.exist");

    });

  });

  describe("log level DEBUG", () => {

    beforeEach(() => {

      cy.get("ion-select[label=\"Log Level\"]")
        .click();

      cy.get("ion-popover")
        .contains("ion-radio", "DEBUG")
        .click();

    });

    it("click DEBUG ==> viewer shows message", () => {

      cy.contains("ion-button", "DEBUG")
        .click();

      cy.get("ionic-logging-viewer")
        .find("ion-item")
        .its("length")
        .should("eq", 1);

    });

  });

});