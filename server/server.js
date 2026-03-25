require('dotenv').config()
const app = require('./config/app')
const { testConnection } = require('./config/db')

const PORT = process.env.PORT || 3000

async function start() {
  // Verify database connection before accepting requests
  const dbOk = await testConnection()
  if (!dbOk) {
    console.error('Cannot connect to MySQL. Check your .env DB_* settings.')
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`\nAM Automobile API running`)
    console.log(`    ➜  http://localhost:${PORT}`)
    console.log(`    ➜  Environment: ${process.env.NODE_ENV || 'development'}\n`)
  })
}

start()
