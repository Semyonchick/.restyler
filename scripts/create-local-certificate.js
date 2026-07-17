'use strict';

const {mkdirSync} = require('fs');
const {resolve} = require('path');
const {spawnSync} = require('child_process');

const certificateDir = resolve(__dirname, '..', '.cert');
const certificatePath = resolve(certificateDir, 'localhost.pem');
const certificateKeyPath = resolve(certificateDir, 'localhost-key.pem');

mkdirSync(certificateDir, {recursive: true});

function runMkcert (args) {
  const command = process.platform === 'win32' ? 'mkcert.exe' : 'mkcert';
  const result = spawnSync(command, args, {stdio: 'inherit'});

  if (result.error && result.error.code === 'ENOENT') {
    console.error('\nmkcert is not installed or is not available in PATH.');
    console.error('Windows: choco install mkcert  or  scoop install mkcert');
    console.error('Then run: npm run cert');
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

runMkcert(['-install']);
runMkcert([
  '-key-file', certificateKeyPath,
  '-cert-file', certificatePath,
  'localhost',
  '127.0.0.1',
  '::1'
]);

console.log(`\nTrusted HTTPS certificate created in ${certificateDir}`);
console.log('Run npm run watch.');
