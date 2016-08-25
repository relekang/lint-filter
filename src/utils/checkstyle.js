// @flow
import _ from 'lodash'

import type { CheckstyleItem } from '../parser'

export function getRulesFromCheckstyle(checkstyle: Array<CheckstyleItem>): Array<string> {
  return _.uniq(_.map(checkstyle, error => {
    const parts = error.source.split('.')
    return parts[parts.length - 1]
  }))
}
