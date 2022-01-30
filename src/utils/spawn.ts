import cp from 'child_process';

export function spawn(file: string, args: Array<string>): Promise<string> {
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
        // @ts-expect-error ---
        error.stdout = stdout;
        // @ts-expect-error ---
        error.stderr = stderr;
        // @ts-expect-error ---
        error.code = code;
        reject(error);
      }
    });
  });
}
