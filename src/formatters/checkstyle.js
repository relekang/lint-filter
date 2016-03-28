import _ from 'lodash'

import checkstyleFormatter from 'checkstyle-formatter'

export default function checkstyle(data) {
  const result = _.map(_.groupBy(data, 'file'), (value, key) => {
    if (!_.isEmpty(_.filter(value, 'isInDiff'))) {
      return {
        filename: key,
        messages: _.filter(value, 'isInDiff').map(item => _.omit(item, ['isInDiff', 'file'])),
      }
    }
    return null
  })

  return checkstyleFormatter(_.filter(result))
}
