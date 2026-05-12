import { createServer } from 'node:http'
import { mkdir } from 'node:fs/promises'
import { PORT, CAPTURE_DIR } from './config.js'
import { handleRequest, init } from './routes.js'

// Ensure capture directory exists
await mkdir(CAPTURE_DIR, { recursive: true })

const server = createServer(handleRequest)

server.listen(PORT, () => {
  console.log(`[camera-service] Listening on port ${PORT}`)
  // Initialize camera detection and stream after server is ready
  init().catch(err => console.error('[camera-service] Init failed:', err))
})

// Graceful shutdown
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    console.log(`[camera-service] Received ${signal}, shutting down...`)
    server.close()
    process.exit(0)
  })
}
