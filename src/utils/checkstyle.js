// @flow
import _ from 'lodash';

import type { CheckstyleItem } from '../parser';

export function getRulesFromCheckstyle(
  checkstyle: Array<CheckstyleItem>
): Array<string> {
  return _.uniq(
    _.map(checkstyle, (error) => {
      const parts = error.source.split('.');
      return parts[parts.length - 1];
    })
  );
}

export function setErrorToWarning(item: CheckstyleItem) {
  return _.assign(
    {},
    item,
    item.severity === 'error' ? { severity: 'warning' } : null
  );
}
