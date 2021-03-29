import {getMeasurement} from "./data-provider.js";
import {QueryParam, sensorQueryFactory} from "../query/query.js";
import Source from "../query/source.js";
import Sensor from "../common/sensor.js";
import {AirqEvent, EventType} from "./airq-event.js";
import createKey from "./key.js";
import {Message} from "./producer.js";
import {timestamp} from "../common/timestamp.js";

class Processor {
    #stationList;
    #asyncProducer;
    #eventFilter;
    #bindedProcessStation;

    constructor(stationList, asyncProducer, eventFilter = undefined) {
        this.#stationList = stationList;
        this.#asyncProducer = asyncProducer;
        this.#eventFilter = (eventFilter) ? eventFilter : (_) => true;
        this.process = this.process.bind(this);
        this.#bindedProcessStation = this.#processStation.bind(this);
    }

    async process() {
        await Promise.all(this.#stationList.map(this.#bindedProcessStation));
    }

    async #processStation(stationName) {
        const measurement = await getMeasurement(stationName);
        const query = sensorQueryFactory(Source.GIOS_API);
        const queryParam = new QueryParam(stationName, Sensor.PM10, measurement.datetime)
        const pm10FromGiosApi = await query(queryParam);
        const payload = {
            timestamp: timestamp(measurement.datetime),
            station: measurement.stataionName,
            oldPm10: measurement.pm10Value,
            newPm10: pm10FromGiosApi,
            source: Source.GIOS_API.toString(),
        }
        const eventType = EventType.UPDATE_GIOS_MEASUREMENT;
        const event = new AirqEvent(eventType, payload);
        if (!this.#eventFilter(event)) return;

        const key = createKey(event);
        const message = new Message(key, event, eventType.topic);
        return await this.#asyncProducer(message)
            .catch(console.error);
    }
}

export default Processor;
