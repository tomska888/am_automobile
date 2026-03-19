// Hostinger Express entry point — must be at repo root as server.js
// Builds the Vue client if server/public/index.html is missing, then starts Express.

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const publicIndex = path.join(__dirname, 'server', 'public', 'index.html')

if (!fs.existsSync(publicIndex)) {
  console.log('🔨  Building Vue client (first run or missing build)...')
  try {
    // Use node to run vite directly — avoids npm PATH issues on Hostinger
    const viteBin = path.join(__dirname, 'node_modules', '.bin', 'vite')
    const clientDir = path.join(__dirname, 'client')

    execSync(`node "${viteBin}" build`, {
      cwd: clientDir,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    })
    console.log('✅  Vue client build complete.')
  } catch (err) {
    console.error('❌  Vue client build failed:', err.message)
    process.exit(1)
  }
}

require('./server/server.js')
