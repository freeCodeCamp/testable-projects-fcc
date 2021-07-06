/* global cy Cypress */

Cypress.Commands.add('checkProjectTests', (projectPath) => {
  cy.visit(projectPath);

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
