# lint-filter

Only show style errors of things that have changed since master. This support tools that support exporting output in checkstyle format. This can be useful if you want to convert a project gradually towards a new config, (e.g. adding a new rule from the latest release of your linter). Another case were this is beneficial is were you do not want to break a build when updating the linter.

[![Build status][build-badge]][build-link] [![Trello][trello-badge]][trello-link] [![Join the conversation at gitter][gitter-badge]][gitter-link]

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

## Contributing
Firstly, all contributions is super appreciated :sparkles:

As you may have noticed, this repository has no issues here on Github. There is a [trello board][trello-link] with planned features and such. If you have questions, bug report or feature requests you are encouraged to drop by our [gitter channel][gitter-link] and say hi. If you are comfortable with it bug reports in form of a pull-request with a broken test would be awesome. *Unsure about where the test belong?* Then create a new file in the test folder with your test. *Unsure about how to do create a pr?* You can check out [How to create a Pull Request on GitHub][pr-tutorial-link], a video tutorial by @kentcdodds or drop by the [gitter channel][gitter-link] and ask for help.


[trello-link]: https://trello.com/b/GDc2OC4T/lint-filter
[trello-badge]: https://img.shields.io/badge/trello-board-blue.svg
[build-link]: https://ci.frigg.io/relekang/lint-filter
[build-badge]: https://ci.frigg.io/relekang/lint-filter.svg
[coverage-badge]: https://ci.frigg.io/relekang/lint-filter/coverage.svg
[gitter-link]: https://gitter.im/relekang/lint-filter
[gitter-badge]: https://badges.gitter.im/relekang/lint-filter.svg
[pr-tutorial-link]: https://egghead.io/lessons/javascript-how-to-create-a-pull-request-on-github
