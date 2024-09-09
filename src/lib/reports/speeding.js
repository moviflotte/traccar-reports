const positions = '/api/positions'

export async function getData(selected, start, end) {
    try {
        for (const deviceId of selected) {
            const url = `${positions}?deviceId=${deviceId}&from=${start}&to=${end}`;
            const response = await fetch(url);
            if (response.ok) {
                return await response.json()
            } else {
                alert(await response.text())
            }
        }
    } catch (e) {
        alert(e.message)
    }
    return {devices: []}
}
