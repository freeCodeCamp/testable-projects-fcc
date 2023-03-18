const { writeFileSync, readdirSync, mkdir } = require('fs');
const path = require('path');

function createProjectFixtures() {
  const projectDir = readdirSync(
    path.join(__dirname, 'src', 'projects'),
    'utf-8'
  );

  let projectObject = {};

  mkdir(path.join(__dirname, 'cypress', 'fixtures'), (err) => {
    if (err) {
      console.error(err);
    }
  });

  projectDir.forEach((project) => {
    // Remove excessive files
    if (project === 'local-test' || project === 'index.pug') {
      return;
    }
    projectObject[project] = '/pages/' + project;
  });

  writeFileSync(
    path.join(__dirname, 'cypress', 'fixtures', 'project-fix.json'),
    JSON.stringify(projectObject, null, 2)
  );

  return projectObject;
}

createProjectFixtures();
