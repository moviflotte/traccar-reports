import {goto} from "$app/navigation";

export const ssr = false

export async function load({fetch}) {
    try {
        const response = await fetch('/api/devices');
        if (response.ok) {
            const devices = await response.json()
            return {devices: devices.slice(0, 500)}
        } else {
            if (response.status === 401) { await goto('/login') }
            if (response.status === 403) { await goto('/login') }
            else { alert(await response.text()) }
        }
    } catch (e) {
        alert(e.message)
    }
    return {devices: []}
}
