# lint-filter

Only show style errors of things that have changed since master. This support tools that support exporting output in checkstyle format. This can be useful if you want to convert a project gradually towards a new config, (e.g. adding a new rule from the latest release of your linter). Another case were this is beneficial is were you do not want to break a build when updating the linter.

[![Build status][build-badge]][build-link] [![Join the conversation at gitter][gitter-badge]][gitter-link]

## Installation

```
npm install --save-dev lint-filter
```

## Usage
You can use this in two different ways, either by reading files or reading from stdin.

### Reading from files

```
lint-filter checkstyle-report.xml
```

### Reading from stdin

```
cat checkstyle-report.xml | lint-filter

# example usage with eslint
eslint . -f checkstyle | lint-filter
```

### Options

```
$ lint-filter -h
  Usage: lint-filter [options] <subcommand|file ...>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --format [format]  The output format
    -b, --branch [branch]  The branch to diff against
```

### Sub commands
The first argument can either be a file or a sub command. The available sub commands are listed
below.

* `list-files` - list the files in the current diff that lint-filter will use. Nice for faster linting.

## Contributing
Firstly, all contributions is super appreciated :sparkles:

If you have questions, bug report or feature requests you are encouraged to drop by our [gitter channel][gitter-link] and say hi. If you are comfortable with it bug reports in form of a pull-request with a broken test would be awesome. *Unsure about where the test belong?* Then create a new file in the test folder with your test. *Unsure about how to do create a pr?* You can check out [How to create a Pull Request on GitHub][pr-tutorial-link], a video tutorial by @kentcdodds or drop by the [gitter channel][gitter-link] and ask for help.


[build-link]: https://ci.frigg.io/relekang/lint-filter
[build-badge]: https://ci.frigg.io/relekang/lint-filter.svg
[coverage-badge]: https://ci.frigg.io/relekang/lint-filter/coverage.svg
[gitter-link]: https://gitter.im/relekang/lint-filter
[gitter-badge]: https://badges.gitter.im/relekang/lint-filter.svg
[pr-tutorial-link]: https://egghead.io/lessons/javascript-how-to-create-a-pull-request-on-github
