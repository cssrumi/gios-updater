const getOrDefault = (envName, defaultValue) => {
    const envValue = process.env[envName];
    return envValue !== undefined ? envValue : defaultValue;
}

const getOrThrow = (envName) => {
    const envValue = process.env[envName];
    if (envValue === undefined) throw Error(`Environment variable: ${envName} is mandatory!`);
    return envValue;
}

const castToInt = (value) => {
    const number = parseInt(value);
    if (isNaN(number)) throw ('value is not type int');
    return number;
}

const castToBoolean = (value) => {
    value = value.toLowerCase();
    switch (value) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            throw("value is not type boolean");
    }
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
const archiveProcessorEnabled = castToBoolean(getOrDefault("ARCHIVE_PROCESSOR_ENABLED", "true"))
const archiveBatchSize = castToInt(getOrDefault("ARCHIVE_BATCH_SIZE", "10"))
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
    ARCHIVE_PROCESSOR_ENABLED: archiveProcessorEnabled,
    ARCHIVE_BATCH_SIZE: archiveBatchSize,
    MIN_RELATIVE_ERROR: minRelativeError,
    ZONE: zone,
}

export default Config;
