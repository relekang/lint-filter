import _ from 'lodash/fp';

import { CheckstyleItem } from '../parser';

export function getRulesFromCheckstyle(
  checkstyle: Array<CheckstyleItem>
): Array<string> {
  return _.flow([
    _.map((error: CheckstyleItem) => {
      const parts = error.source.split('.');
      return parts[parts.length - 1];
    }),
    _.uniq,
  ])(checkstyle);
}

export function setErrorToWarning<
  T extends {
    severity?: 'error' | 'warning' | 'info';
  }
>(item: T) {
  return {
    ...item,
    ...(item.severity === 'error' ? { severity: 'warning' } : {}),
  };
}
