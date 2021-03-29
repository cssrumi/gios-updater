import pool from "../config/database.js";
import Config from "../config/config.js";
import Measurement from "../common/measurement.js"
import {DateTime} from "luxon";

const from = `${parseInt(Config.PROCESS_WINDOW) - 1}`;
const to = `${Config.PROCESS_WINDOW}`;

const enrichedDataQuery = `
    select *
    from enriched_data
    where station = $1
    and timestamp <= now() - ($2 || ' hours')::INTERVAL
    and timestamp >= now() - ($3 || ' hours')::INTERVAL
`;

const archiveEnrichedData = `
    select *
    from enriched_data
    where timestamp <= now() - ($1 || ' hours'):: INTERVAL
    order by timestamp, id limit $2
    offset $3
`;

const parseTimestamp = (timestamp) => DateTime.fromJSDate(timestamp);
const mapRow = (row) => {
    return (row) ? new Measurement(row.station, row.pm10, row.pm25, parseTimestamp(row.timestamp)) : null;
}

export const getMeasurement = async (stationName) => {
    return await pool.query(enrichedDataQuery, [stationName, from, to])
        .then(res => res.rows[0])
        .then(mapRow)
        .catch(err => console.error(`Error occurred during enriched_data query: ${err.message}`));
}

export const getArchiveMeasurements = async (offset) => {
    return await pool.query(archiveEnrichedData, [to, Config.ARCHIVE_BATCH_SIZE, offset])
        .then(res => res.rows.map(mapRow).filter(measurement => measurement !== null))
        .catch(err => console.error(`Error occurred during enriched_data query: ${err.message}`));
}
