import { NUXT_EVENTS_URL, INTERNAL_API_KEY } from './config.js'
import type { CameraEvent } from './types.js'

export async function pushEvent(event: CameraEvent): Promise<void> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (INTERNAL_API_KEY) {
      headers['x-api-key'] = INTERNAL_API_KEY
    }

    await fetch(NUXT_EVENTS_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(event)
    })
  } catch (err) {
    console.error('[events] Failed to push event to Nuxt:', err)
  }
}
