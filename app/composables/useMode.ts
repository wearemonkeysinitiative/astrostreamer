export type AppMode = 'chill' | 'manual' | 'astro'

function getAutoMode(offset: number): 'chill' | 'astro' {
  const now = new Date()
  const utcHours = now.getUTCHours()
  const localHour = (utcHours + offset) % 24
  // Astro mode: 22:00 — 06:00 local time
  return (localHour >= 22 || localHour < 6) ? 'astro' : 'chill'
}

export function useMode() {
  const config = useRuntimeConfig()
  const offset = Number(config.public.timezoneOffset) || 3

  const manualOverride = useState<AppMode | null>('mode-override', () => null)
  const autoMode = useState<'chill' | 'astro'>('mode-auto', () => getAutoMode(offset))

  const mode = computed<AppMode>(() => manualOverride.value ?? autoMode.value)

  function setMode(value: AppMode) {
    manualOverride.value = value
  }

  function resetToAuto() {
    manualOverride.value = null
    autoMode.value = getAutoMode(offset)
  }

  const isManual = computed(() => manualOverride.value !== null)

  return { mode, isManual, setMode, resetToAuto }
}
