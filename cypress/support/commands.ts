/// <reference types="cypress" />

Cypress.Commands.add('getDataTestId', (dataTestSelector: string) => {
  return cy.get(`[data-testid="${dataTestSelector}"]`)
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getDataTestId(dataTestSelector: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

export {}
