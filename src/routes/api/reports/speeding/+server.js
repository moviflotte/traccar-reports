import {forwardRequest} from "$lib";

export const GET = async event => {
    console.log(event)
    try {
        const response = await fetch('/api/reports/route');
        if (response.ok) {
            return await response.json()
        } else {
            alert(await response.text())
        }
    } catch (e) {
        alert(e.message)
    }
    return new Response(200)
}

