import {DateTime} from 'luxon';

const eventTypeValue = (value, topic) => Object.freeze({
    toString: () => value,
    topic: topic,
});

export const EventType = Object.freeze({
    UPDATE_GIOS_MEASUREMENT: eventTypeValue("UpdateGiosMeasurement", "update.gios.measurement"),

    parse: function (str) {
        const obj = this.values().filter(value => str === value)[0]
        if (obj === undefined) throw new Error("Invalid event type")
    },

    values: function () {
        return [this.UPDATE_GIOS_MEASUREMENT];
    },
});


export class AirqEvent {
    constructor(eventType, payload) {
        if (!EventType.values().includes(eventType)) throw new Error(`Invalid EventType: ${eventType}`);
        this.timestamp = DateTime.now().ts;
        this.payload = payload;
        this.eventType = eventType.toString();
    }
}
