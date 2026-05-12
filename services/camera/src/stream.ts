import { spawn, type ChildProcess } from 'node:child_process'
import { MEDIAMTX_RTSP_URL } from './config.js'
import { pushEvent } from './events.js'

export class StreamManager {
  private gphotoProc: ChildProcess | null = null
  private ffmpegProc: ChildProcess | null = null
  private _running = false

  get running(): boolean {
    return this._running
  }

  async start(): Promise<void> {
    if (this._running) return

    console.log('[stream] Starting gphoto2 → ffmpeg → RTSP pipeline')

    this.gphotoProc = spawn('gphoto2', ['--capture-movie', '--stdout'], {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    this.ffmpegProc = spawn('ffmpeg', [
      '-i', '-',
      '-vf', 'format=yuv420p',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-tune', 'zerolatency',
      '-f', 'rtsp',
      MEDIAMTX_RTSP_URL
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    // Pipe gphoto2 stdout → ffmpeg stdin
    this.gphotoProc.stdout!.pipe(this.ffmpegProc.stdin!)

    this.gphotoProc.stderr?.on('data', (data: Buffer) => {
      const msg = data.toString().trim()
      if (msg) console.log('[gphoto2]', msg)
    })

    this.ffmpegProc.stderr?.on('data', (data: Buffer) => {
      const msg = data.toString().trim()
      if (msg && !msg.startsWith('frame=')) console.log('[ffmpeg]', msg)
    })

    const onExit = (name: string) => (code: number | null) => {
      console.log(`[stream] ${name} exited with code ${code}`)
      this._running = false
    }

    this.gphotoProc.on('exit', onExit('gphoto2'))
    this.ffmpegProc.on('exit', onExit('ffmpeg'))

    this._running = true

    await pushEvent({
      kind: 'system',
      message: 'RTSP stream started',
      detail: `${MEDIAMTX_RTSP_URL} · 1920×1080 30fps`
    })
  }

  async stop(): Promise<void> {
    if (!this._running) return

    console.log('[stream] Stopping pipeline')

    // SIGTERM gphoto2 first
    if (this.gphotoProc && !this.gphotoProc.killed) {
      this.gphotoProc.kill('SIGTERM')
    }
    if (this.ffmpegProc && !this.ffmpegProc.killed) {
      this.ffmpegProc.kill('SIGTERM')
    }

    // Wait for graceful exit, then SIGKILL
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        if (this.gphotoProc && !this.gphotoProc.killed) this.gphotoProc.kill('SIGKILL')
        if (this.ffmpegProc && !this.ffmpegProc.killed) this.ffmpegProc.kill('SIGKILL')
        resolve()
      }, 2000)

      let exited = 0
      const check = () => { if (++exited >= 2) { clearTimeout(timeout); resolve() } }

      if (this.gphotoProc) this.gphotoProc.on('exit', check)
      else check()
      if (this.ffmpegProc) this.ffmpegProc.on('exit', check)
      else check()
    })

    this.gphotoProc = null
    this.ffmpegProc = null
    this._running = false
  }
}
