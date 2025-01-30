async function getPositions(selected, traccar, searchParams, request) {
    const result = []
    for (const deviceId of selected) {
        const url = `${traccar}/api/positions?deviceId=${deviceId}&from=${searchParams.get('start')}&to=${searchParams.get('end')}`;
        console.log(url)
        const response = await fetch(url,
            {headers: {cookie: request.headers.get('cookie')}, redirect: 'follow'})
        if (response.ok) {
            result.push(await response.json())
        } else {
            throw new Error('error status ' + response.status + ' ' + await response.text())
        }
    }
    return result.flat()
}

export async function load({request, platform}) {
    const traccar = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
    const {searchParams} = new URL(request.url)
    const selected = searchParams.get('selected').split(',')
    return {positions: await getPositions(selected, `http://${traccar}`, searchParams, request)}
}
