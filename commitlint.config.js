/**
 * Commitlint - valida mensagens de commit no padrão Conventional Commits.
 * Exemplos: feat: ..., fix: ..., hotfix: ..., chore: ..., docs: ...
 * @see https://commitlint.js.org/
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // nova funcionalidade
        'fix',      // correção de bug
        'hotfix',   // correção urgente em produção
        'docs',     // documentação
        'style',    // formatação (não altera código)
        'refactor', // refatoração
        'perf',     // performance
        'test',     // testes
        'chore',    // tarefas de build, CI, etc.
        'ci',
        'build',
      ],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
  },
};
