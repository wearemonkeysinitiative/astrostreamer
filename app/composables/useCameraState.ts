export const ISO_SCALE = ['100', '200', '400', '800', '1600', '3200', '6400', '12800'] as const

export const SHUTTER_MAN = [
  '1/4000', '1/3200', '1/2500', '1/2000', '1/1600', '1/1250', '1/1000',
  '1/800', '1/640', '1/500', '1/400', '1/320', '1/250', '1/200', '1/160',
  '1/125', '1/100', '1/80', '1/60', '1/50', '1/40', '1/30', '1/25',
  '1/20', '1/15', '1/13', '1/10', '1/8', '1/6', '1/5', '1/4',
  '0.3', '0.5', '0.8', '1', '1.3', '1.6', '2', '2.5', '3.2',
  '4', '5', '6', '8', '10', '13', '15', '20', '25', '30'
] as const

export const SHUTTER_AST = [
  '8', '10', '13', '15', '20', '25', '30', 'bulb'
] as const

export const WB_PRESETS = ['AUTO', 'DAYLIGHT', 'SHADE', 'CLOUDY', 'TUNGSTEN', 'FLUOR'] as const

// Map UI field names to gphoto2 config keys
const FIELD_TO_CONFIG: Record<string, string> = {
  iso: 'iso',
  shutter: 'shutterspeed',
  wb: 'whitebalance',
  focus: 'focus'
}

export interface CameraState {
  iso: string
  shutter: string
  aperture: string
  focus: number
  wb: string
}

export function useCameraState() {
  const state = useState<CameraState>('camera-state', () => ({
    iso: '400',
    shutter: '1/125',
    aperture: '1.8',
    focus: 62,
    wb: 'DAYLIGHT'
  }))

  const { setConfig } = useCamera()

  async function setCamPatch(patch: Partial<CameraState>) {
    // Optimistic update
    state.value = { ...state.value, ...patch }

    // Send changes to camera service
    for (const [field, value] of Object.entries(patch)) {
      const configKey = FIELD_TO_CONFIG[field]
      if (!configKey) continue
      try {
        await setConfig(configKey, String(value))
      } catch (err) {
        console.error(`Failed to set ${configKey}=${value}:`, err)
      }
    }
  }

  function step(field: 'iso' | 'shutter', options: readonly string[], direction: 1 | -1) {
    const current = field === 'iso' ? state.value.iso : state.value.shutter
    const idx = options.indexOf(current)
    if (idx === -1) return
    const next = idx + direction
    if (next < 0 || next >= options.length) return
    setCamPatch({ [field]: options[next] })
  }

  return { state, setCamPatch, step }
}
