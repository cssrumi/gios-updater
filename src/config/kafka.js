import {Kafka} from "kafkajs";
import Config from "./config.js";

const kafka = new Kafka({
    clientId: 'gios-updater-app',
    brokers: [Config.KAFKA_HOST]
});

const producer = kafka.producer();
await producer.connect();

process.on('SIGTERM', async () => producer.disconnect().then(() => console.log('Kafka producer disconnected.')));

export default producer;
