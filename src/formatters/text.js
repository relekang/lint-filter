import _ from 'lodash'
import chalk from 'chalk'

export default function text(result) {
  return _.map(result, file => {
    const messages = _.map(file.messages, message =>
      `  ✖ ${chalk.gray(`${message.line}:${message.column}`)} ${message.message}\n`
    ).join('')
    return `${chalk.underline(`File: ${file.filename}`)}\n${messages}`
  }).join('')
}
