export type EventKind = 'setting' | 'system' | 'capture' | 'detect' | 'error' | 'telemetry'

export interface EventEntry {
  id: string
  time: string
  kind: EventKind
  message: string
  detail?: string
  thumbnail?: string
}

export const EVENT_KIND_META: Record<EventKind, { tag: string; color: string; label: string }> = {
  setting:   { tag: 'SET', color: 'var(--accent)',   label: 'Settings' },
  system:    { tag: 'SYS', color: 'var(--accent-2)', label: 'System' },
  capture:   { tag: 'CAP', color: 'var(--accent-3)', label: 'Capture' },
  detect:    { tag: 'DET', color: 'var(--good)',      label: 'Detect' },
  error:     { tag: 'ERR', color: 'var(--bad)',       label: 'Error' },
  telemetry: { tag: 'TEL', color: 'var(--ink-3)',     label: 'Telemetry' }
}

const SEED_EVENTS: EventEntry[] = [
  { id: '1',  time: '07:14:02', kind: 'system',    message: 'Camera connected',           detail: 'Canon EOS 600D · USB · /dev/bus/usb/001/004' },
  { id: '2',  time: '07:14:03', kind: 'system',    message: 'RTSP stream started',        detail: 'rtsp://orangepi.local:8554/cam0 · 1920×1080 30fps' },
  { id: '3',  time: '07:14:04', kind: 'telemetry', message: 'Orange Pi',                  detail: 'CPU 38% · 49.2°C' },
  { id: '4',  time: '07:14:11', kind: 'setting',   message: 'Значение ISO установлено',   detail: '100' },
  { id: '5',  time: '07:14:14', kind: 'setting',   message: 'Выдержка установлена',       detail: '1/125' },
  { id: '6',  time: '07:14:22', kind: 'setting',   message: 'Баланс белого',              detail: 'DAYLIGHT' },
  { id: '7',  time: '07:14:48', kind: 'capture',   message: 'Frame captured',             detail: 'IMG_0042.CR2 · 14-bit RAW · 23.4 MB' },
  { id: '8',  time: '07:15:03', kind: 'setting',   message: 'Фокус установлен',           detail: '78/100' },
  { id: '9',  time: '07:15:30', kind: 'system',    message: 'Mode → Astrolandscape' },
  { id: '10', time: '07:15:31', kind: 'setting',   message: 'Значение ISO установлено',   detail: '3200' },
  { id: '11', time: '07:15:31', kind: 'setting',   message: 'Выдержка установлена',       detail: '20"' },
  { id: '12', time: '07:16:02', kind: 'capture',   message: 'Frame captured',             detail: 'IMG_0043.CR2 · 20s · ISO 3200' },
  { id: '13', time: '07:16:08', kind: 'detect',    message: 'Plate-solve complete',       detail: '47 stars matched' },
  { id: '14', time: '07:16:08', kind: 'detect',    message: 'Vega · α Lyr · mag 0.03',   detail: 'center field' },
  { id: '15', time: '07:16:08', kind: 'detect',    message: 'Deneb · α Cyg · mag 1.25' },
  { id: '16', time: '07:16:08', kind: 'detect',    message: 'Altair · α Aql · mag 0.77' },
  { id: '17', time: '07:16:09', kind: 'detect',    message: 'Summer Triangle asterism overlaid' },
  { id: '18', time: '07:17:14', kind: 'telemetry', message: 'Sensor temperature',         detail: '22.4°C · noise nominal' },
  { id: '19', time: '07:18:01', kind: 'error',     message: 'gphoto2: device busy',       detail: 'retried (1/3) · recovered in 240ms' },
  { id: '20', time: '07:18:44', kind: 'setting',   message: 'Выдержка установлена',       detail: '30"' }
]

export function useEvents() {
  const events = useState<EventEntry[]>('event-log', () => [...SEED_EVENTS])

  const filters = useState<Record<EventKind, boolean>>('event-filters', () => ({
    setting: true,
    system: true,
    capture: true,
    detect: true,
    error: true,
    telemetry: true
  }))

  const filteredEvents = computed(() =>
    events.value.filter(e => filters.value[e.kind])
  )

  function addEvent(event: Omit<EventEntry, 'id'>) {
    events.value.unshift({
      ...event,
      id: String(Date.now())
    })
  }

  function clearEvents() {
    events.value = []
  }

  return { events, filters, filteredEvents, addEvent, clearEvents }
}
