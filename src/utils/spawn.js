import cp from 'child_process'
import Promise from 'bluebird'

export default function spawn(file, args) {
  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''

    const process = cp.spawn(file, args)
    process.stdout.on('data', data => { stdout += data })
    process.stderr.on('data', data => { stderr += data })

    process.on('close', code => {
      if (code === 0) {
        resolve(stdout)
      } else {
        const error = new Error(`${file} ${args.join(' ')} failed`)
        error.stdout = stdout
        error.stderr = stderr
        error.code = code
        reject(error)
      }
    })
  })
}
