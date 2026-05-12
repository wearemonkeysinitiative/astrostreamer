export interface CameraStatus {
  connected: boolean
  model: string
  lens: string
  serial: string
  port: string
  streaming: boolean
}

export interface ConfigEntry {
  key: string
  value: string
  choices: string[]
}

export interface CaptureResult {
  ok: boolean
  filename: string
  size: string
  format: string
  path: string
}

export interface CameraEvent {
  kind: 'setting' | 'system' | 'capture' | 'detect' | 'error' | 'telemetry'
  message: string
  detail?: string
  thumbnail?: string
}
