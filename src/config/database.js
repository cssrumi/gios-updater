import Client from 'pg';
import Config from "./config.js";

const pool = new Client.Pool({
    user: Config.PG_USER,
    password: Config.PG_PASSWORD,
    host: Config.PG_HOST,
    port: Config.PG_PORT,
    database: Config.DATABASE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

process.on('SIGTERM', () => pool.end().then(() => console.log('PG pool has been ended.')));

export default pool;
