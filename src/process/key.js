import {EventType} from "./airq-event.js";


const createUpdateGiosMeasurementKey = (event) => {
    if (!event || !event.payload || !event.payload.timestamp || !event.payload.station) {
        throw new Error(`Invalid event: ${JSON.stringify(event)}`)
    }

    return `${event.payload.timestamp}-${event.payload.station}`;
}

const createKey = (event) => {
    switch (event.eventType) {
        case EventType.UPDATE_GIOS_MEASUREMENT:
        case EventType.UPDATE_GIOS_MEASUREMENT.toString():
            return createUpdateGiosMeasurementKey(event);
        default:
            throw new Error(`Unsupported EventType: ${event.eventType}`);
    }
}

export default createKey;
