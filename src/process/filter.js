import {EventType} from "./airq-event.js";
import Config from "../config/config.js";
import {DateTime} from 'luxon';


const formatTimestamp = (timestamp) => {
    const dt = DateTime.fromSeconds(timestamp)
    return dt.toFormat('yyyy-MM-dd hh:mm')
}

const updateGiosMeasurementFilter = (event) => {
    const payload = event.payload;
    if (!payload) return false;
    if (!payload.newPm10) return false;
    if (!payload.oldPm10) return true;
    if (payload.newPm10 === payload.oldPm10) return false;
    const relErr = (Math.abs(payload.oldPm10 - payload.newPm10) / payload.oldPm10) * 100;
    if (relErr > Config.MIN_RELATIVE_ERROR) return true;
    const formattedTimestamp = formatTimestamp(payload.timestamp);
    console.debug(`Relative error for ${formattedTimestamp} - '${payload.station}' was to small ${relErr.toFixed(2)}`)
    return false;
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
