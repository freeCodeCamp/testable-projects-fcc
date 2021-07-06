/* global cy */
const projectPaths = require('../fixtures/project-fix.json');

describe('Test all projects', () => {
  const project = Object.entries(projectPaths['projects']);

  for (const [projectName, projectPath] of project) {
    it('project ' + projectName + ' should work correctly', () => {
      cy.checkProjectTests(projectPath);
    });
  }
});
