export function useCamera() {
  async function setConfig(key: string, value: string) {
    return await $fetch('/api/camera/config', {
      method: 'POST',
      body: { key, value }
    })
  }

  async function getConfig(key: string) {
    return await $fetch(`/api/camera/config/${key}`)
  }

  async function list() {
    return await $fetch('/api/camera/config')
  }

  async function capture() {
    return await $fetch('/api/capture', { method: 'POST' })
  }

  async function getStatus() {
    return await $fetch('/api/camera/status')
  }

  return { setConfig, getConfig, list, capture, getStatus }
}
