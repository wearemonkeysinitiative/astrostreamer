import { EventEmitter } from 'node:events'

export interface CameraEvent {
  id: string
  time: string
  kind: 'setting' | 'system' | 'capture' | 'detect' | 'error' | 'telemetry'
  message: string
  detail?: string
  thumbnail?: string
}

const MAX_HISTORY = 200

class EventBus extends EventEmitter {
  private history: CameraEvent[] = []

  push(event: Omit<CameraEvent, 'id' | 'time'>) {
    const now = new Date()
    const full: CameraEvent = {
      ...event,
      id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 6),
      time: now.toTimeString().slice(0, 8)
    }
    this.history.unshift(full)
    if (this.history.length > MAX_HISTORY) {
      this.history.length = MAX_HISTORY
    }
    this.emit('event', full)
    return full
  }

  getHistory(): CameraEvent[] {
    return this.history
  }

  clearHistory() {
    this.history = []
  }
}

// Singleton via globalThis to survive HMR in dev
const key = '__astro_event_bus__'

export function useEventBus(): EventBus {
  if (!(globalThis as any)[key]) {
    (globalThis as any)[key] = new EventBus()
  }
  return (globalThis as any)[key]
}
