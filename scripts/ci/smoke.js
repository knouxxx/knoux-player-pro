const { spawn } = require('child_process');

const timeoutMs = 15000;
const startupGraceMs = 3000;

const child = spawn('npx', ['electron', '.'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
  shell: process.platform === 'win32',
});

let started = false;
let exited = false;
let allowExit = false;

const startupTimer = setTimeout(() => {
  started = true;
}, startupGraceMs);

const timeoutTimer = setTimeout(() => {
  if (!exited) {
    allowExit = true;
    child.kill();
  }
}, timeoutMs);

child.on('exit', (code) => {
  exited = true;
  clearTimeout(startupTimer);
  clearTimeout(timeoutTimer);

  if (allowExit) {
    process.exit(0);
  }

  if (code && code !== 0) {
    process.exit(code);
  }

  process.exit(1);
});

child.on('error', () => {
  clearTimeout(startupTimer);
  clearTimeout(timeoutTimer);
  process.exit(1);
});
