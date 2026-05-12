import type { IncomingMessage, ServerResponse } from 'node:http'
import { CameraLock } from './lock.js'
import { StreamManager } from './stream.js'
import { pushEvent } from './events.js'
import * as gphoto from './gphoto.js'
import type { CameraStatus } from './types.js'

const stream = new StreamManager()
const lock = new CameraLock(stream)

let detectedCamera: { model: string; port: string } | null = null

function json(res: ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

function error(res: ServerResponse, status: number, message: string) {
  json(res, { error: message }, status)
}

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()))
      } catch {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', `http://localhost`)
  const path = url.pathname
  const method = req.method || 'GET'

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  try {
    // GET /status
    if (method === 'GET' && path === '/status') {
      if (!detectedCamera) {
        detectedCamera = await gphoto.autoDetect()
      }
      const status: CameraStatus = {
        connected: !!detectedCamera,
        model: detectedCamera?.model || 'Not connected',
        lens: 'Helios 44MS 58mm f/2.0',
        serial: '',
        port: detectedCamera?.port || '',
        streaming: stream.running
      }
      json(res, status)
      return
    }

    // GET /config/list
    if (method === 'GET' && path === '/config/list') {
      const entries = await lock.execute(() => gphoto.listConfig(), true)
      const result: Record<string, { value: string; choices: string[] }> = {}
      for (const e of entries) {
        result[e.key] = { value: e.value, choices: e.choices }
      }
      json(res, result)
      return
    }

    // GET /config/:key
    const configGetMatch = path.match(/^\/config\/([a-zA-Z0-9_]+)$/)
    if (method === 'GET' && configGetMatch) {
      const key = configGetMatch[1]
      const entry = await lock.execute(() => gphoto.getConfig(key), true)
      json(res, entry)
      return
    }

    // POST /config/:key  { value }
    if (method === 'POST' && configGetMatch) {
      const key = configGetMatch[1]
      const body = await readBody(req)
      if (!body.value) {
        error(res, 400, 'value is required')
        return
      }
      await lock.execute(() => gphoto.setConfig(key, body.value), true)

      await pushEvent({
        kind: 'setting',
        message: `${key} set`,
        detail: body.value
      })

      json(res, { ok: true })
      return
    }

    // POST /capture
    if (method === 'POST' && path === '/capture') {
      const result = await lock.execute(() => gphoto.captureImage(), true)

      await pushEvent({
        kind: 'capture',
        message: 'Frame captured',
        detail: `${result.filename} · ${result.format} · ${result.size}`
      })

      json(res, result)
      return
    }

    // POST /stream/start
    if (method === 'POST' && path === '/stream/start') {
      await stream.start()
      json(res, { ok: true, streaming: true })
      return
    }

    // POST /stream/stop
    if (method === 'POST' && path === '/stream/stop') {
      await stream.stop()
      json(res, { ok: true, streaming: false })
      return
    }

    // 404
    error(res, 404, `Not found: ${method} ${path}`)
  } catch (err: any) {
    console.error(`[routes] ${method} ${path} error:`, err)
    error(res, 500, err.message || 'Internal error')
  }
}

// Auto-detect camera and start stream on boot
export async function init() {
  console.log('[init] Detecting camera...')
  detectedCamera = await gphoto.autoDetect()

  if (detectedCamera) {
    console.log(`[init] Found: ${detectedCamera.model} at ${detectedCamera.port}`)

    await pushEvent({
      kind: 'system',
      message: 'Camera connected',
      detail: `${detectedCamera.model} · USB · ${detectedCamera.port}`
    })

    console.log('[init] Starting stream...')
    try {
      await stream.start()
    } catch (err) {
      console.error('[init] Stream start failed:', err)
      await pushEvent({
        kind: 'error',
        message: 'Stream start failed',
        detail: String(err)
      })
    }
  } else {
    console.log('[init] No camera detected')
    await pushEvent({
      kind: 'error',
      message: 'No camera detected',
      detail: 'Connect a Canon DSLR via USB and restart'
    })
  }
}
