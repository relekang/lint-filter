// @flow
import cp from 'child_process';

export default function spawn(
  file: string,
  args: Array<string>
): Promise<string> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const process = cp.spawn(file, args);
    process.stdout.on('data', (data) => {
      stdout += data;
    });
    process.stderr.on('data', (data) => {
      stderr += data;
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        const error = new Error(`${file} ${args.join(' ')} failed`);
        // $SuppressFlow
        error.stdout = stdout;
        // $SuppressFlow
        error.stderr = stderr;
        // $SuppressFlow
        error.code = code;
        reject(error);
      }
    });
  });
}
