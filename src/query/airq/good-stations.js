import pool from "../../config/database.js";

const goodStationQuery = `SELECT NAME FROM gios.good_stations`;


const findAllGoodStations = async () => {
    return pool.query(goodStationQuery)
        .then(res => res.rows.map(row => row.name))
        .catch(err => console.log(`Error occurred during good_stations query: ${err.message}`));
}

export default findAllGoodStations;
