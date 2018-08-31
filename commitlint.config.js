const { types, scopes, allowCustomScopes } = require('./commitizen.config');

const ENABLE = 2;
const WARNING = 1;
const DISABLE = 0;

const validTypes = types.map(type => type.value);
const validScopes = scopes;
const scopeValidationLevel = allowCustomScopes ? WARNING : ENABLE;

module.exports = {
  extends: ['@commitlint/config-conventional'],

  // Add your own rules. See http://marionebl.github.io/commitlint
  rules: {
    'type-enum': [ENABLE, 'always', validTypes],
    'scope-enum': [scopeValidationLevel, 'always', validScopes],
    'subject-case': [DISABLE, 'always']
  }
};
