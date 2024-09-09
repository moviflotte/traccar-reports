export const GET = async () => {
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

