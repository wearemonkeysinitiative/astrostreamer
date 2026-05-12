import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { ConfigEntry, CaptureResult } from './types.js'
import { CAPTURE_DIR } from './config.js'

const exec = promisify(execFile)

const GPHOTO2 = 'gphoto2'

export async function autoDetect(): Promise<{ model: string; port: string } | null> {
  try {
    const { stdout } = await exec(GPHOTO2, ['--auto-detect'], { timeout: 10_000 })
    const lines = stdout.trim().split('\n')
    // Skip header lines (first 2)
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      // Format: "Model                          Port"
      const match = line.match(/^(.+?)\s{2,}(.+)$/)
      if (match) {
        return { model: match[1].trim(), port: match[2].trim() }
      }
    }
    return null
  } catch {
    return null
  }
}

export async function listConfig(): Promise<ConfigEntry[]> {
  const { stdout } = await exec(GPHOTO2, ['--list-all-config'], { timeout: 30_000 })
  const entries: ConfigEntry[] = []
  let current: Partial<ConfigEntry> | null = null

  for (const line of stdout.split('\n')) {
    if (line.startsWith('/main/')) {
      if (current?.key) {
        entries.push(current as ConfigEntry)
      }
      // Extract the short key from full path
      const parts = line.trim().split('/')
      current = { key: parts[parts.length - 1], value: '', choices: [] }
    } else if (current) {
      if (line.startsWith('Current: ')) {
        current.value = line.slice('Current: '.length).trim()
      } else if (line.startsWith('Choice: ')) {
        const match = line.match(/^Choice: \d+ (.+)$/)
        if (match) {
          current.choices!.push(match[1].trim())
        }
      }
    }
  }
  if (current?.key) {
    entries.push(current as ConfigEntry)
  }

  return entries
}

export async function getConfig(key: string): Promise<{ value: string; choices: string[] }> {
  const { stdout } = await exec(GPHOTO2, ['--get-config', key], { timeout: 10_000 })

  let value = ''
  const choices: string[] = []

  for (const line of stdout.split('\n')) {
    if (line.startsWith('Current: ')) {
      value = line.slice('Current: '.length).trim()
    } else if (line.startsWith('Choice: ')) {
      const match = line.match(/^Choice: \d+ (.+)$/)
      if (match) choices.push(match[1].trim())
    }
  }

  return { value, choices }
}

export async function setConfig(key: string, value: string): Promise<void> {
  await exec(GPHOTO2, ['--set-config', `${key}=${value}`], { timeout: 10_000 })
}

export async function captureImage(): Promise<CaptureResult> {
  const { stdout } = await exec(
    GPHOTO2,
    ['--capture-image-and-download', '--filename', `${CAPTURE_DIR}/%f.%C`],
    { timeout: 60_000 }
  )

  // Parse output for filename
  const match = stdout.match(/Saving file as (.+)/)
  const filename = match ? match[1].trim().split('/').pop()! : 'unknown.cr2'

  // Get file size
  let size = 'unknown'
  try {
    const { stdout: ls } = await exec('ls', ['-lh', `${CAPTURE_DIR}/${filename}`])
    const parts = ls.trim().split(/\s+/)
    size = parts[4] || 'unknown'
  } catch { /* ignore */ }

  return {
    ok: true,
    filename,
    size,
    format: filename.toLowerCase().endsWith('.cr2') ? '14-bit RAW' : 'JPEG',
    path: `${CAPTURE_DIR}/${filename}`
  }
}
