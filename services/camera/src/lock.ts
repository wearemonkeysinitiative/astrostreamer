import { StreamManager } from './stream.js'

interface QueuedOp {
  execute: () => Promise<any>
  requiresExclusive: boolean
  resolve: (value: any) => void
  reject: (reason: any) => void
}

const RESTART_DELAY_MS = 500

export class CameraLock {
  private queue: QueuedOp[] = []
  private processing = false

  constructor(private stream: StreamManager) {}

  execute<T>(op: () => Promise<T>, requiresExclusive: boolean): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ execute: op, requiresExclusive, resolve, reject })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing) return
    this.processing = true

    while (this.queue.length > 0) {
      const op = this.queue.shift()!

      try {
        if (op.requiresExclusive && this.stream.running) {
          // Stop stream → execute → restart stream
          await this.stream.stop()
          await delay(RESTART_DELAY_MS)
          const result = await op.execute()
          op.resolve(result)
          await delay(RESTART_DELAY_MS)
          await this.stream.start()
        } else {
          const result = await op.execute()
          op.resolve(result)
        }
      } catch (err) {
        op.reject(err)
        // Try to restart stream if it was stopped
        if (op.requiresExclusive && !this.stream.running) {
          try {
            await delay(RESTART_DELAY_MS)
            await this.stream.start()
          } catch (streamErr) {
            console.error('[lock] Failed to restart stream:', streamErr)
          }
        }
      }
    }

    this.processing = false
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
