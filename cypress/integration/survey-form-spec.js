/* global cy */
describe('survey form', () => {
  it('Should be possible to visit', () => {
    cy.visit('/survey-form');
  });

  it('I can see a title with id="title" in H1 sized text', () => {
    cy.get('h1').should('have.id', 'title').and('not.be.empty');
  });

  it('I can see a short explanation with id="description" in P sized text', () => {
    cy.get('p').should('have.id', 'description').and('not.be.empty');
  });

  it('I can see a <form> with id="survey-form"', () => {
    cy.get('form').should('have.id', 'survey-form');
  });

  it(`Inside the form element, I am required to enter my name
    in a field with id="name". If I do not enter a name I will see an HTML5
    validation error.`, () => {
    cy.get('form').find('#name').should('have.attr', 'required');
  });

  it(`Inside the form element, I am required to enter an email
    in a field with id="email". If I do not enter an email I will see an
    HTML5 validation error.`, () => {
    cy.get('form').find('#email').should('have.attr', 'required');
  });

  it(`If I enter an email that is not formatted correctly, I will
    see an HTML5 validation error.`, () => {
    cy.get('form').find('input[type=email]');
  });

  it(`Inside the form, I can enter a number in a field with
    id="number".`, () => {
    cy.get('form').find('#number').type('69');
  });

  it(`If I enter non-numbers in the number input, I will see an
    HTML5 validation error.`, () => {
    cy.get('input[type=number]').should('have.id', 'number');
  });

  it(`If I enter numbers outside the range of the number input, I
    will see an HTML5 validation error.`, () => {
    cy.get('#number')
      .should('have.attr', 'min', '10')
      .and('have.attr', 'max', '99');
  });

  it(`For the name, email, and number input fields inside the
    form I can see corresponding labels that describe the purpose of each
    field with the following ids: id="name-label", id="email-label", and
    id="number-label".`, () => {
    cy.get('form').find('label#name-label').should('not.be.empty');

    cy.get('form').find('label#email-label').should('not.be.empty');

    cy.get('form').find('label#number-label').should('not.be.empty');
  });

  it(`For the name, email, and number input fields, I can see
    placeholder text that gives me a description or instructions for each
    field.'`, () => {
    cy.get('#name').invoke('attr', 'placeholder').should('not.be.empty');

    cy.get('#email').invoke('attr', 'placeholder').should('not.be.empty');

    cy.get('#number').invoke('attr', 'placeholder').should('not.be.empty');
  });

  it(`Inside the form element, I can select an option from a
    dropdown that has corresponding id="dropdown".`, () => {
    cy.get('form').find('select').should('have.id', 'dropdown');

    cy.get('select#dropdown').find('option').its('length').should('be.gt', 1);
  });

  it(`Inside the form element, I can select a field from one or
    more groups of radio buttons. Each group should be grouped using the name
    attribute. Each radio button must have a value attribute.`, () => {
    cy.get('form').find('input[type=radio]').its('length').should('be.gt', 1);

    cy.get('form')
      .find('input[type=radio]')
      .should('have.attr', 'value')
      .should('not.be.empty');

    cy.get('form')
      .find('input[type=radio]')
      .should('have.attr', 'name')
      .should('not.be.empty');
  });

  it(`Inside the form element, I can select several fields from a
    series of checkboxes, each of which must have a value attribute.`, () => {
    cy.get('form')
      .find('input[type=checkbox]')
      .its('length')
      .should('be.gt', 1);

    cy.get('form')
      .find('input[type=checkbox]')
      .should('have.attr', 'value')
      .should('not.be.empty');
  });

  it(`Inside the form element, I am presented with a <textarea>
    at the end for additional comments.`, () => {
    cy.get('form').find('textarea');
  });

  it(`Inside the form element, I am presented with a button with
    id="submit" to submit all my inputs.`, () => {
    cy.get('form').find('#submit').should('have.attr', 'type', 'submit');
  });
});
