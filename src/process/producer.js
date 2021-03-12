import Config from "../config/config.js";
import {Kafka} from "kafkajs";

const kafka = new Kafka({
    clientId: 'gios-updater-app',
    brokers: [Config.KAFKA_HOST]
});

const producer = kafka.producer();
await producer.connect();

const createMessage = (event) => {
    return {value: JSON.stringify(event)}
};

const produce = async (event, topic) => {
    await producer.send({
        topic: topic,
        messages: [createMessage(event)]
    });
    console.log(`Event send: ${JSON.stringify(event)}, on topic: ${topic}`);
}

process.on('SIGTERM', async () => producer.disconnect().then(() => console.log('Kafka producer disconnected.')));

export default produce;
