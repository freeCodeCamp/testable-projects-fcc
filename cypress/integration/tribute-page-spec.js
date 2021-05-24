/* global cy */

describe('tribute page test', () => {
  it('Should be possible to visit', () => {
    cy.visit('/tribute-page');
  });

  it(`should have an main-element with the id="main",
     which contains all other elments`, () => {
    cy.get('main').should('have.id', 'main');
    cy.get('main').find('img');
    cy.get('main').find('figure');
    cy.get('main').find('h1');
  });

  it(`should have an h1-element with the id="title"
     that desribes the subject of the tribute page`, () => {
    cy.get('h1').should('not.be.empty').and('have.id', 'title');
  });

  it('should have a <figure> element or <div> with id="img-div"', () => {
    cy.get('#img-div').should('be.visible');
  });

  it('should have a <img> element within the "img-div" elment with the id="image"', () => {
    cy.get('#img-div').find('img').should('have.id', 'image');
  });

  it(`should have a figcaption or div element which 
    contains textual content describing the image shown in "img-div"`, () => {
    cy.get('#img-div').find('#img-caption').should('not.be.empty');
  });

  it(`should have an element with a corresponding id="tribute-info",
     which contains textual content describing the contents of the tribute page`, () => {
    cy.get('#tribute-info').should('not.be.empty');
  });

  it(`should have an <a> element with the corresponding 
    id="tribute-link", whichs contains additonal information about the subject`, () => {
    cy.get('a')
      .should('have.id', 'tribute-link')
      .should('have.attr', 'target', '_blank')
      .and('not.be.empty');
  });

  // TODO: #Layout test
});
