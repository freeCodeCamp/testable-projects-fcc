const types = [
  {
    value: 'feat',
    name: 'feat:     A new project test or feature is being added.'
  },
  {
    value: 'fix',
    name: `fix:      Modifying an existing projects tests, fixing a bug
            or text.`
  },
  {
    value: 'docs',
    name: 'docs:     Documentation only changes to readme, guides, etc.'
  },
  {
    value: 'test',
    name: `test:     Adding missing tests to tooling (NOT to be used for
            projects tests).`
  },
  {
    value: 'chore',
    name: `chore:    Changes to the build process or auxiliary tools
            and libraries such as documentation generation.`
  },
  {
    value: 'revert',
    name: 'revert:   Revert a commit.'
  }
];

const scopes = ['tests', 'tools', 'scripts'];

module.exports = {
  types,
  scopes,
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'perf', 'refactor']
};
