import { readFile } from 'node:fs/promises'

export default defineEventHandler(async () => {
  let cpuTemp = 0
  let cpuLoad = 0

  try {
    // Linux: read CPU temperature from thermal zone
    const tempStr = await readFile('/sys/class/thermal/thermal_zone0/temp', 'utf-8')
    cpuTemp = Math.round(parseInt(tempStr) / 100) / 10 // millidegrees → degrees, 1 decimal
  } catch {
    // Not on Linux or no thermal zone — use process uptime as fallback indicator
    cpuTemp = 0
  }

  try {
    // Linux: read load average
    const loadStr = await readFile('/proc/loadavg', 'utf-8')
    const parts = loadStr.trim().split(' ')
    cpuLoad = Math.round(parseFloat(parts[0]) * 100) // 1-min load as percentage (approx for single core)
  } catch {
    // Fallback: use process memory as rough indicator
    const mem = process.memoryUsage()
    cpuLoad = Math.round((mem.heapUsed / mem.heapTotal) * 100)
  }

  return {
    cpuTemp,
    cpuLoad,
    uptime: Math.round(process.uptime()),
    memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  }
})
