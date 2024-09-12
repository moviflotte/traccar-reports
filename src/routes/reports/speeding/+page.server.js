async function getEvents(selected, traccar, searchParams, request) {
    const result = []
    for (const deviceId of selected) {
        const url = `http://${traccar}/api/positions?deviceId=${deviceId}&from=${searchParams.get('start')}&to=${searchParams.get('end')}`;
        console.log(url)
        const response = await fetch(url, {...request, redirect: 'follow'});
        if (response.ok) {
            result.push(await getSpeedEvents(selected, await response.json()))
        } else {
            console.error(response, await response.text())
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
const minMinutes = 2
function positionsFar(position1, position2) {
    return new Date(position2.fixTime).getTime() - new Date(position1.fixTime).getTime() > minMinutes * 60 * 1000
}

async function getSpeedEvents (deviceIds, routes, threshold=0, minimumMinutes = 0, country='BR') {
    const chunk = 100
    const results = []
    for (const d of deviceIds) {
        const route = routes.filter(r => r.deviceId === parseInt(d))
        let current
        for (let i = 0; i < route.length; i += chunk) {
            const result = await invokeValhalla(route, i, chunk, country, threshold, results)
            if (!result) continue
            const {
                matched_points,
                edges,
                shape
            } = result
            const shapePoints = decodePolyline(shape)
            matched_points.forEach((mp, mIndex) => {
                const edge = edges[mp.edge_index]
                const position = route[mIndex + i]
                if (edge && (edge.speed_limit + (threshold || 0)) < position.speed * 1.852) {
                    if (!current ||
                        current.edges.slice(-1)[0].speed_limit !== edge.speed_limit ||
                        positionsFar(current.positions.slice(-1)[0], position)) {
                        current = {
                            shapes: [],
                            mPoints: [],
                            edges: [],
                            positions: []
                        }
                        results.push(current)
                    }
                    current.mPoints.push(mp)
                    current.positions.push(position)
                    if (!current.edges.find(e => e.id === edge.id)) {
                        current.edges.push(edge)
                        current.shapes.push(shapePoints.slice(edge.begin_shape_index, edge.end_shape_index+1))
                    }
                }
            })
        }
    }
    return results
}
let  countError = 0, countSuccess = 0
async function invokeValhalla (route, i, chunk, country, threshold, results, retry = 3) {
    const slice = route.slice(i, i + chunk)
    const url = `http://valhalla-${country}.pinme.io:8002/trace_attributes`
    const body = {
        costing: 'auto',
        shape_match: 'map_snap',
        shape: slice.map(p => ({
            lon: p.longitude,
            lat: p.latitude
        }))
    }
    console.log(url)
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
    countSuccess++
    return response.json()
}


// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
function decodePolyline(str, precision) {
    let index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
}
