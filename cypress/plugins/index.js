/* eslint-disable no-unused-vars */
const { writeFileSync, readdirSync } = require('fs');
const path = require('path');

function createProjectFixtures() {
  const projectDir = readdirSync(
    path.join(__dirname, '../../src/projects'),
    'utf-8'
  );

  let projectObject = { projects: {} };

  projectDir.forEach((project) => {
    // Remove excessive files
    if (project === 'local-test' || project === 'index.pug') {
      return;
    }
    projectObject.projects[project] = '/' + project;
  });

  writeFileSync(
    path.join('./cypress/fixtures/project-fix.json'),
    JSON.stringify(projectObject, null, 2)
  );

  return projectObject;
}

module.exports = function (on, config) {
  on('task', {
    createProjectPaths() {
      return createProjectFixtures();
    }
  });
};
