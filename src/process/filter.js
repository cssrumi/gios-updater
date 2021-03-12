import {EventType} from "./airq-event.js";


const updateGiosMeasurementFilter = (event) => {
    const payload = event.payload;
    if (!payload) return false;
    if (!payload.newPm10 && !payload.oldPm10) return false;
    return payload.newPm10 !== payload.oldPm10;
}

export const eventFilter = (event) => {
    switch (event.eventType) {
        case EventType.UPDATE_GIOS_MEASUREMENT:
        case EventType.UPDATE_GIOS_MEASUREMENT.toString():
            return updateGiosMeasurementFilter(event);
        default:
            throw new Error(`Unsupported EventType: ${event.eventType}`);
    }
}
