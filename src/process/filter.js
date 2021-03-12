import {EventType} from "./airq-event.js";
import Config from "../config/config.js";


const updateGiosMeasurementFilter = (event) => {
    const payload = event.payload;
    if (!payload) return false;
    if (!payload.newPm10) return false;
    if (!payload.oldPm10) return true;
    if (payload.newPm10 === payload.oldPm10) return false;
    const relErr = (Math.abs(payload.oldPm10 - payload.newPm10) / payload.oldPm10) * 100;
    if (relErr > Config.MIN_RELATIVE_ERROR) return true;
    console.debug(`Relative error was to small ${relErr}`)
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
