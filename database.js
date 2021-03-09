import Client from 'pg';
import Config from "./config.js";

const pgClient = new Client({
    user: Config.PG_USER,
    password: Config.PG_PASSWORD,
    host: Config.PG_HOST,
    port: Config.PG_PORT,
    database: Config.DATABASE,
});
await pgClient.connect()


export default pgClient;
