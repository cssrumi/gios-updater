import {getSensorData, getStation} from "./query/gios/gios.js";
import {DateTime} from "luxon";
import Config from "./config/config.js";
import {sensorQueryFactory, QueryParam, findAllStations} from "./query/query.js";
import Source from "./query/source.js";
import Sensor from "./common/sensor.js";
import getMeasurement from "./process/data-provider.js";
import pool from "./config/database.js";
import cron from "node-cron";
import Processor from "./process/processor.js";
import {eventFilter} from "./process/filter.js";

const stationName = "AM8 Gdańsk Wrzeszcz";

const main = async () => {
    const stationList = await findAllStations();
    console.log(`Processing data for: [${stationList}]`)
    const asyncProducer = async (event) => console.log(JSON.stringify(event));
    const processor = new Processor(stationList, asyncProducer, eventFilter);
    await cron.schedule(Config.CRON, processor.process, undefined);
};

const gios = async () => {
    const station = await getStation(stationName);
    const date = DateTime
        .now()
        .minus({days: 2})
        .startOf('day')
        .plus({hours: 2})
        .setZone(Config.ZONE);

    const pm10Value = await getSensorData(station.pm10SensorId, date);
    const pm25Value = await getSensorData(station.pm25SensorId, date);
    console.log(`PM10: ${pm10Value}, PM2.5: ${pm25Value}`);
}

const query = async () => {
    const date = DateTime
        .now()
        .minus({days: 2})
        .startOf('day')
        .plus({hours: 2})
        .setZone(Config.ZONE);
    const queryParam = new QueryParam(stationName, Sensor.PM10, date);
    const sensorQuery = sensorQueryFactory(Source.GIOS_API);
    const pm10 = await sensorQuery(queryParam);
    console.log(`PM10: ${pm10}`);
}

const source = async () => {
    const measurement = await getMeasurement(stationName);
    console.log(`Measurement found: ${JSON.stringify(measurement)}`)
    pool.end()
}

(async () => await main())();
