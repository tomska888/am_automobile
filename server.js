// Hostinger Express entry point — must be at repo root as server.js
// Builds the Vue client if server/public/index.html is missing, then starts Express.

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const publicIndex = path.join(__dirname, 'server', 'public', 'index.html')

if (!fs.existsSync(publicIndex)) {
  console.log('🔨  Building Vue client (first run or missing build)...')
  try {
    execSync('npm install --prefix client && npm run build --prefix client', {
      cwd: __dirname,
      stdio: 'inherit'
    })
    console.log('✅  Vue client build complete.')
  } catch (err) {
    console.error('❌  Vue client build failed:', err.message)
    process.exit(1)
  }
}

require('./server/server.js')
