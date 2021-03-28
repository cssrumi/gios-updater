const getOrDefault = (envName, defaultValue) => {
    const envValue = process.env[envName];
    return envValue !== undefined ? envValue : defaultValue;
}

const getOrThrow = (envName) => {
    const envValue = process.env[envName];
    if (envValue === undefined) throw Error(`Environment variable: ${envName} is mandatory!`);
    return envValue;
}

const giosApi = getOrDefault("GIOS_API", "https://powietrze.gios.gov.pl/pjp/archives");
const kafkaHost = getOrDefault("KAFKA_HOST", "localhost:9092");
const kafkaTopic = getOrDefault("KAFKA_TOPIC", "update.gios.measurement");
const pgUser = getOrDefault("PG_USER", "airqreadonly");
const pgPassword = getOrThrow("PG_PASSWORD");
const pgHost = getOrDefault("PG_HOST", "10.1.1.50")
const pgPort = getOrDefault("PG_PORT", "5432")
const database = getOrDefault("DATABASE", "warehouse")
const processWindow = getOrDefault("PROCESS_WINDOW", "74")
const cron = getOrDefault("CRON", "0 0 * * * *")
const limit=getOrDefault("LIMIT_POSTGRES","ALL")
const offset=getOrDefault("OFFSET_POSTGRES","0")
const minRelativeError = getOrDefault("MIN_RELATIVE_ERROR", "10")
const zone = 'Europe/Warsaw'

const Config = {
    GIOS_API: giosApi,
    KAFKA_TOPIC: kafkaTopic,
    KAFKA_HOST: kafkaHost,
    PG_USER: pgUser,
    PG_PASSWORD: pgPassword,
    PG_HOST: pgHost,
    PG_PORT: pgPort,
    DATABASE: database,
    PROCESS_WINDOW: processWindow,
    CRON: cron,
    LIMIT_POSTGRES:limit,
    OFFSET_POSTGRES:offset,
    MIN_RELATIVE_ERROR: minRelativeError,
    ZONE: zone,
}

export default Config;
