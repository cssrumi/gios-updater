import pgClient from "../config/database.js";

const getSourceQuery = `select * from enriched_data
                        where timestamp <= now() - interval '73 HOURS'
                        and timestamp >= now() - interval  '74 HOURS';`;


const getSource = async () => pgClient.query(getSourceQuery);
