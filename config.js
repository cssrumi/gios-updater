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
const kafkaHost = getOrDefault("KAFKA_HOST", "update.gios.measurement");
const kafkaTopic = getOrDefault("KAFKA_TOPIC", "localhost:9092");
const pgUser = getOrDefault("PG_USER", "airqreadonly");
const pgPassword = getOrThrow("PG_PASSWORD");
const pgHost = getOrDefault("PG_HOST", "10.1.1.50")
const pgPort = getOrDefault("PG_PORT", "5432")
const database = getOrDefault("DATABASE", "warehouse")

const Config = {
    GIOS_API: giosApi,
    KAFKA_TOPIC: kafkaTopic,
    KAFKA_HOST: kafkaHost,
    PG_USER: pgUser,
    PG_PASSWORD: pgPassword,
    PG_HOST: pgHost,
    PG_PORT: pgPort,
    DATABASE: database,
}

export default Config;
