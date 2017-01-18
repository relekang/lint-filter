// @flow
import _ from 'lodash'
import chalk from 'chalk'

import type { OutputFormat, Stats } from './'

function resultText(result) {
  return _.map(result, file => {
    const messages = _.map(file.messages, message => {
      const icon = message.severity === 'warning' ? chalk.yellow('⚠') : chalk.red('✖')
      return `  ${icon} ${chalk.gray(`${message.line}:${message.column}`)} ${message.message}\n`
    }).join('')
    return `${chalk.underline(`File: ${file.filename}`)}\n${messages}`
  }).join('')
}

function statsText(stats) {
  return `${stats.errors.in} of ${stats.errors.total} errors and ` +
    `${stats.warnings.in} of ${stats.warnings.total} warnings`
}

export default function text(result: OutputFormat, stats: Stats) {
  return `${resultText(result)}\n${statsText(stats)}`
}
