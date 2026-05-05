export function useCamera() {
    const config = useRuntimeConfig()
    const api = config.public.cameraApi

    async function setConfig(key: string, value: string) {
        return await $fetch(`${api}/set`, {
            method: "POST",
            body: { key, value }
        });
    }

    async function getConfig(key: string) {
        return await $fetch(`${api}/get?key=${key}`);
    }

    async function list() {
        return await $fetch(`${api}/list`);
    }

    return { setConfig, getConfig, list };
}
