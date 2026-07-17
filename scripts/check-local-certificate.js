'use strict';

const {existsSync} = require('fs');
const {resolve} = require('path');

const certificatePath = resolve(__dirname, '..', '.cert', 'localhost.pem');
const certificateKeyPath = resolve(__dirname, '..', '.cert', 'localhost-key.pem');

if (!existsSync(certificatePath) || !existsSync(certificateKeyPath)) {
  console.error('Trusted localhost certificate is missing. Run npm run cert.');
  process.exit(1);
}
