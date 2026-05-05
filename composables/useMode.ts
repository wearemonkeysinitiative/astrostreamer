export type AppMode = 'chill' | 'astro'

function getAutoMode(): AppMode {
  const now = new Date()
  // Yaroslavl is UTC+3
  const utcHours = now.getUTCHours()
  const yaroslavlHour = (utcHours + 3) % 24
  // Astro mode: 22:00 — 06:00 Yaroslavl time
  return (yaroslavlHour >= 22 || yaroslavlHour < 6) ? 'astro' : 'chill'
}

export function useMode() {
  const manualOverride = useState<AppMode | null>('mode-override', () => null)
  const autoMode = useState<AppMode>('mode-auto', () => getAutoMode())

  const mode = computed<AppMode>(() => manualOverride.value ?? autoMode.value)

  function setMode(value: AppMode) {
    manualOverride.value = value
  }

  function resetToAuto() {
    manualOverride.value = null
    autoMode.value = getAutoMode()
  }

  const isManual = computed(() => manualOverride.value !== null)

  return { mode, isManual, setMode, resetToAuto }
}
