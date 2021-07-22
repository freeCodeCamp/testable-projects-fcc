/* global cy Cypress */

Cypress.Commands.add('checkProjectTests', (projectPath) => {
  cy.visit(projectPath);

  // Wait for the page to finish loading. In some cases, just for example the
  // D3 projects, projects are loading remote data, so we have to be generous
  // here.
  // TODO: A better way to do this is to change all of the example projects to
  // set a variable such as 'fccTestableProjectsDataLoaded', and then we can
  // wait for that variable to be true. But that will require changing every
  // example project.
  cy.wait(2000);

  cy.get('#fcc_test_suite_wrapper')
    .shadow()
    .find('#fcc_test_message-box-rerun-button')
    .click();

  cy.get('#fcc_test_suite_wrapper')
    .shadow()
    .find('.fcc_test_btn-done', { timeout: 60000 })
    .click();

  cy.get('#fcc_test_suite_wrapper')
    .shadow()
    .then(($wrapper) => {
      if ($wrapper.find('.test.fail').length) {
        cy.wrap($wrapper)
          .find('.test.fail')
          .each(($el) => {
            const text = $el.get(0).innerText;
            cy.task('log', text).then((result) => {
              // fail Cypress test
              throw new Error('Error: ' + result);
            });
          });
      }
    });
});
