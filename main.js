import {getSensorData, getStation} from "./enrichment/gios/gios.js";
import {DateTime} from "luxon";

const main = async function () {
    const station = await getStation("AM8 Gdańsk Wrzeszcz");
    console.log(station);
    const date = DateTime.now().minus({days: 2});

    const pm10data = await getSensorData(station.pm10SensorId, date);
    console.log(pm10data)
    const pm25data = await getSensorData(station.pm25SensorId, date);
    console.log(pm25data)
};

(async () => await main())();
