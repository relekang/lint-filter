import checkstyle from './checkstyle'

const formatters = {
  checkstyle,
}

export function formatOutput(format, data) {
  if (!formatters.hasOwnProperty(format)) {
    throw new Error(`Formatter with name '${format}' does not exist.`)
  }
  return formatters[format](data)
}
