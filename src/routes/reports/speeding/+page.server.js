import distance from "@turf/distance";
import {point} from "@turf/helpers";

async function getEvents(selected, traccar, searchParams, request) {
    const result = []
    for (const deviceId of selected) {
        const url = `http://${traccar}/api/positions?deviceId=${deviceId}&from=${searchParams.get('start')}&to=${searchParams.get('end')}`;
        const response = await fetch(url, request);
        if (response.ok) {
            result.push(await getSpeedEvents(selected, await response.json()))
        } else {
            throw new Error(await response.text())
        }
    }
    return result.flat()
}

export async function load({request, platform}) {
    const traccar = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
    const {searchParams} = new URL(request.url)
    const selected = searchParams.get('selected').split(',')
    return {events: await getEvents(selected, traccar, searchParams, request)}
}

async function getSpeedEvents (deviceIds, routes, threshold=0, minimumMinutes = 0, country='BR') {
    const chunk = 100
    const events = []
    for (const d of deviceIds) {
        const route = routes.filter(r => r.deviceId === parseInt(d))
        const results = []
        for (let i = 0; i < route.length; i += chunk) {
            await invokeValhalla(route, i, chunk, country, threshold, results)
        }
        const reduced = results.reduce((acc, cur, idx, src) => {
            const last = acc.length && acc.slice(-1)[0]
            if (last && new Date(cur.fixTime) - new Date(src[idx - 1].fixTime) < 1000 * 60 * 2) {
                last.eventTime = new Date(cur.fixTime) - new Date(last.fixTime)
                last.attributes.maxSpeed = Math.max(last.attributes.maxSpeed, cur.speed)
                last.distance += distance(point([cur.longitude, cur.latitude]), point([src[idx - 1].longitude, src[idx - 1].latitude]))
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
let  countError = 0, countSuccess = 0
async function invokeValhalla (route, i, chunk, country, threshold, results, retry = 3) {
    const slice = route.slice(i, i + chunk)
    const url = `http://valhalla-${country}.pinme.io:8002/trace_attributes`
    const body = {
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
    }
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        const e = await response.json()
        if (e.error_code === 444 || e.error_code === 171) {
            console.warn(i, i+chunk, e)
            return
        }
        if (--retry) {
            console.error('retry', retry, e.message, (e.response && e.response.data) || url, 'deviceId',
                slice[0] && slice[0].deviceId, slice[0] && slice[0].address, slice[0] && slice[0].fixTime, country, 'chunk', chunk,
                'success', countSuccess, 'error', countError)
            return invokeValhalla(route, i, chunk, country, threshold, results, retry)
        } else {
            console.error(e.message, (e.response && e.response.data) || url, 'deviceId',
                slice[0] && slice[0].deviceId, slice[0] && slice[0].address, slice[0] && slice[0].fixTime, country, 'chunk', chunk, 'success', countSuccess, 'error', countError)
        }
        countError++
    }
    const {
        // eslint-disable-next-line camelcase
        matched_points,
        edges
    } = await response.json()
    countSuccess++
    // eslint-disable-next-line camelcase
    matched_points.forEach((mp, mIndex) => {
        const edge = edges[mp.edge_index]
        const position = route[mIndex + i]
        if (edge && (edge.speed_limit + (threshold || 0)) < position.speed * 1.852) {
            results.push({ ...mp, ...edge, ...position, position })
        }
    })

}

