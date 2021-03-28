import {getArchiveMeasurements} from "./data-provider.js";
import {QueryParam, sensorQueryFactory} from "../query/query.js";
import Source from "../query/source.js";
import Sensor from "../common/sensor.js";
import {AirqEvent, EventType} from "./airq-event.js";
import createKey from "./key.js";
import {Message} from "./producer.js";
import {timestamp} from "../common/timestamp.js";
import Config from "../config/config.js";

class ArchiveProcessor {
    #asyncProducer;
    #eventFilter;
    #bindedProcessStation;

    constructor(asyncProducer, eventFilter = undefined) {
        this.#asyncProducer = asyncProducer;
        this.#eventFilter = (eventFilter) ? eventFilter : (_) => true;
        this.process = this.process.bind(this);
        this.#bindedProcessStation = this.#processStation.bind(this);
    }

    async process() {
        for (let offset = 0; ; offset += Config.ARCHIVE_BATCH_SIZE) {
            const archivedMeasurements = await getArchiveMeasurements(offset);
            await Promise.all(archivedMeasurements.map(this.#bindedProcessStation));
            if (archivedMeasurements.length != Config.ARCHIVE_BATCH_SIZE) break;
        }
    }

    async #processStation(measurement) {

        const query = sensorQueryFactory(Source.GIOS_API);
        const queryParam = new QueryParam(measurement.stataionName, Sensor.PM10, measurement.datetime)
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

export default ArchiveProcessor;
