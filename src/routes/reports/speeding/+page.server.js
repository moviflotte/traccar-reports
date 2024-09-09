export async function load({request, platform}) {
    const traccar = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
    const {searchParams} = new URL(request.url)
    await getData(traccar, searchParams.get('selected'), searchParams.get('start'), searchParams.get('end'))
    return {
        events: []
    };
}

async function getSpeedEvents (deviceIds, routes, threshold=0, minimumMinutes = 0, country='BR') {
    const chunk = 100
    const events = []
    for (const d of deviceIds) {
        const route = routes.filter(r => r.deviceId === d.id)
        const results = []
        for (let i = 0; i < route.length; i += chunk) {
            await invokeValhalla(route, i, chunk, country, threshold, results)
        }
        const reduced = results.reduce((acc, cur, idx, src) => {
            const last = acc.length && acc.slice(-1)[0]
            if (last && new Date(cur.fixTime) - new Date(src[idx - 1].fixTime) < 1000 * 60 * 2) {
                last.eventTime = new Date(cur.fixTime) - new Date(last.fixTime)
                last.attributes.maxSpeed = Math.max(last.attributes.maxSpeed, cur.speed)
                last.distance += distance.default(point([cur.longitude, cur.latitude]), point([src[idx - 1].longitude, src[idx - 1].latitude]))
            } else {
                cur.positionId = cur && cur.id
                cur.roadSpeedLimit = cur.speed_limit
                cur.deviceId = d.id
                cur.attributes = { speedLimit: cur.speed_limit, speed: cur.speed, maxSpeed: cur.speed }
                cur.eventTime = 0
                cur.distance = 0
                acc.push(cur)
            }
            return acc
        }, [])
        events.push(...reduced)
    }
    return events.filter(e => e.eventTime >= minimumMinutes * 60 * 1000)
}

async function invokeValhalla (route, i, chunk, country, threshold, results, retry = 3) {
    const slice = route.slice(i, i + chunk)
    const url = `http://valhalla-${country}.pinme.io:8002/trace_attributes`
    try {
        const {
            // eslint-disable-next-line camelcase
            matched_points,
            edges
        } = await axios.post(url,
            {
                costing: 'auto',
                shape_match: 'map_snap',
                filters: {
                    attributes: [
                        'admin.country_code',
                        'admin.country_text',
                        'admin.state_code',
                        'admin.state_text',
                        'edge.names',
                        'edge.way_id',
                        'edge.speed_limit',
                        'matched.point',
                        'matched.type',
                        'matched.edge_index'
                    ],
                    action: 'include'
                },
                shape: slice.map(p => ({
                    lon: p.longitude,
                    lat: p.latitude
                }))
            }, { timeout: 50000 })
            .then(r => r.data)
        countSuccess++
        // eslint-disable-next-line camelcase
        matched_points.forEach((mp, mIndex) => {
            const edge = edges[mp.edge_index]
            const position = route[mIndex + i]
            if (edge && (edge.speed_limit + (threshold || 0)) < position.speed * 1.852) {
                results.push({ ...mp, ...edge, ...position, position })
            }
        })
    } catch (e) {
        countError++
        if (e.response && e.response.data && e.response.data.error_code === 444) {
            console.warn(e.response.data.error)
            return
        }
        if (--retry) {
            console.error('retry', retry, e.message, (e.response && e.response.data) || url, 'deviceId',
                slice[0] && slice[0].deviceId, slice[0] && slice[0].address, slice[0] && slice[0].fixTime, country, 'chunk', chunk,
                'success', countSuccess, 'error', countError, lastSuccessDuration)
            return invokeValhalla(route, i, chunk, country, threshold, results, retry)
        } else {
            console.error(e.message, (e.response && e.response.data) || url, 'deviceId',
                slice[0] && slice[0].deviceId, slice[0] && slice[0].address, slice[0] && slice[0].fixTime, country, 'chunk', chunk, 'success', countSuccess, 'error', countError, lastSuccessDuration)
        }
    }
}

async function getData(traccar, selected, start, end) {
    for (const deviceId of selected.split(',')) {
        const url = `http://${traccar}/api/positions?deviceId=${deviceId}&from=${start}&to=${end}`;
        const response = await fetch(url);
        if (response.ok) {
            await getSpeedEvents(selected, await response.json())
        } else {
            console.log(await response.text())
        }
    }
    return {devices: []}
}
