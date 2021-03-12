import Source from "./source.js";
import Sensor from "../common/sensor.js";
import {getSensorData, getStation} from "./gios/gios.js";
import {getAuth} from "./gios/client.js";
import {DateTime} from "luxon";
import findAllGoodStations from './airq/good-stations.js'

const airqMeasurementQuery = async (queryParam) => {
    throw new Error(`${Source.AIRQ_MEASUREMENT} query not implemented`);
}

const giosApiQuery = async (queryParam) => {
    const auth = await getAuth();
    const station = await getStation(queryParam.stationName, auth);
    const sensorId = station.getSensorId(queryParam.sensor);
    return await getSensorData(sensorId, queryParam.date)
};

const queryMap = Object.freeze(new Map([
    [Source.AIRQ_MEASUREMENT, airqMeasurementQuery],
    [Source.GIOS_API, giosApiQuery]
]));

export class QueryParam {
    constructor(stationName, sensor, date) {
        if (!(date instanceof DateTime)) throw new Error(`Invalid date type: ${date}`);
        this.stationName = stationName;
        this.sensor = (Sensor.values().includes(sensor)) ? sensor : Sensor.parse(sensor);
        this.date = date;
    }
}

export const sensorQueryFactory = (source) => {
    if (!Source.values().includes(source)) source = Source.parse(source)
    return queryMap.get(source)
}

export const findAllStations = async () => {
    return await findAllGoodStations();
}
