import pool from "../config/database.js";
import Config from "../config/config.js";
import Measurement from "../common/measurement.js"
import {DateTime} from "luxon";

const from = `${parseInt(Config.PROCESS_WINDOW) - 1} HOURS`;
const to = `${Config.PROCESS_WINDOW} HOURS`;
const enrichedDataQuery = `
    select * from enriched_data
    where station = $1
    and timestamp <= now() - interval '${from}'
    and timestamp >= now() - interval  '${to}'
`;

const archiveEnrichedData =
    `select * from enriched_data 
    where timestamp <= now()- interval '${to}' 
    order by timestamp
limit $1
 offset $2`;

const parseTimestamp = (timestamp) => DateTime.fromJSDate(timestamp);
const mapRow = (row) => {
    return (row) ? new Measurement(row.station, row.pm10, row.pm25, parseTimestamp(row.timestamp)) : null;
}

const mapRows = (rows) => {
    let measurements = [];

    for (const row of rows) {
        (row) ? measurements.push(new Measurement(row.station, row.pm10, row.pm25, parseTimestamp(row.timestamp))) : null;
    }
    return measurements;
}

export const getMeasurement = async (stationName) => {
    return await pool.query(enrichedDataQuery, [stationName])
        .then(res => res.rows[0])
        .then(mapRow)
        .catch(err => console.error(`Error occurred during enriched_data query: ${err.message}`));
}

export const getArchiveData = async (offset) => {
    try {
        const res = await pool.query(archiveEnrichedData, [Config.LIMIT_POSTGRES, offset])
        return mapRows(res.rows)
    }
    catch(err){
        console.log(`Error occurred during enriched_data query: ${err.message}`)
    }
}


