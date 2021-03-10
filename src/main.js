import {getSensorData, getStation} from "./query/gios/gios.js";
import {DateTime} from "luxon";
import Config from "./config/config.js";
import {asyncQuery, QueryParam} from "./query/query.js";
import Source from "./query/source.js";
import Sensor from "./common/sensor.js";

const main = async () => {
    // await gios();
    await query();
};

const gios = async () => {
    const station = await getStation("AM8 Gdańsk Wrzeszcz");
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
    const queryParam = new QueryParam("AM8 Gdańsk Wrzeszcz", Sensor.PM10, date);
    const query = asyncQuery(Source.GIOS_API);
    const pm10 = await query(queryParam);
    console.log(`PM10: ${pm10}`);
}

(async () => await main())();
