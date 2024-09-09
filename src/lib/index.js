export async function forwardRequest({ request, platform }) {
    try {
        const host = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
        const url = new URL(request.url)
        url.host = host
        url.port = 80
        url.protocol = 'http:'
        return await fetch(new Request(url, request))
    } catch (e) {
        return new Response(e.message, {status: 500})
    }
}
