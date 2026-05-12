export function isMockMode(): boolean {
  return process.env.MOCK_CAMERA === 'true' || process.env.MOCK_CAMERA === '1'
}

export const MOCK_STATUS = {
  connected: true,
  model: 'Canon EOS 600D',
  lens: 'Helios 44MS 58mm f/2.0',
  serial: 'MOCK-12345',
  port: '/dev/bus/usb/001/004',
  streaming: true
}

export const MOCK_CONFIG: Record<string, { value: string; choices: string[] }> = {
  iso: {
    value: '400',
    choices: ['100', '200', '400', '800', '1600', '3200', '6400', '12800']
  },
  shutterspeed: {
    value: '1/125',
    choices: [
      '1/4000', '1/3200', '1/2500', '1/2000', '1/1600', '1/1250', '1/1000',
      '1/800', '1/640', '1/500', '1/400', '1/320', '1/250', '1/200', '1/160',
      '1/125', '1/100', '1/80', '1/60', '1/50', '1/40', '1/30', '1/25',
      '1/20', '1/15', '1/13', '1/10', '1/8', '1/6', '1/5', '1/4',
      '0.3', '0.5', '0.8', '1', '1.3', '1.6', '2', '2.5', '3.2',
      '4', '5', '6', '8', '10', '13', '15', '20', '25', '30', 'bulb'
    ]
  },
  whitebalance: {
    value: 'Daylight',
    choices: ['Auto', 'Daylight', 'Shade', 'Cloudy', 'Tungsten', 'Fluorescent', 'Flash']
  },
  autoexposuremode: {
    value: 'Manual',
    choices: ['Manual', 'P', 'TV', 'AV']
  }
}

// Mutable state for mock set operations
const mockState: Record<string, string> = {}

export function getMockConfig(key: string) {
  const entry = MOCK_CONFIG[key]
  if (!entry) return null
  return {
    value: mockState[key] ?? entry.value,
    choices: entry.choices
  }
}

export function setMockConfig(key: string, value: string) {
  const entry = MOCK_CONFIG[key]
  if (!entry) return false
  if (!entry.choices.includes(value)) return false
  mockState[key] = value
  return true
}

export function listMockConfig() {
  const result: Record<string, { value: string; choices: string[] }> = {}
  for (const [key, entry] of Object.entries(MOCK_CONFIG)) {
    result[key] = {
      value: mockState[key] ?? entry.value,
      choices: entry.choices
    }
  }
  return result
}
