import _ from 'lodash'

export function getRulesFromCheckstyle(checkstyle) {
  return _.uniq(_.map(checkstyle, error => {
    const parts = error.source.split('.')
    return parts[parts.length - 1]
  }))
}
