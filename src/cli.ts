import yargs from 'yargs/yargs';

export type Options = {
  command: string | null;
  files: Array<string>;
  format: string;
  branch: string | undefined;
  linter: string;
  warning: boolean;
  hash?: string;
};

export function parseOptions(): Options {
  const args = yargs(process.argv.slice(2))
    .usage('Usage: lint-filter [options] <subcommand|file ...>')
    .options({
      help: { type: 'boolean', alias: 'h' },
      format: { type: 'string', alias: 'f', default: 'text' },
      branch: { type: 'string', alias: 'b' },
      linter: { type: 'string', alias: 'l', default: 'eslint' },
      warning: { type: 'boolean', alias: 'w' },
    }).argv;
  let command: string | null = typeof args._[0] === 'string' ? args._[0] : null;

  if (command && !['generate-config', 'list-files'].includes(command)) {
    command = null;
  }

  return {
    command,
    files: args._.map((item) => `${item}`),
    format: process.env['LINT_FILTER_FORMAT'] || args.format,
    branch: process.env['LINT_FILTER_BRANCH'] || args.branch,
    linter: process.env['LINT_FILTER_LINTER'] || args.linter,
    warning: process.env['LINT_FILTER_WARNING']
      ? JSON.parse(process.env['LINT_FILTER_WARNING'])
      : args.warning,
  };
}
