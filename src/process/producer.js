import {Producer, KafkaClient} from 'kafka-node'
import Config from "../config/config.js";


const kafkaClient = new KafkaClient({
    kafkaHost: Config.KAFKA_HOST
});

const producer = new Producer(kafkaClient);

const createKafkaMsg = (data) => [{
    topic: Config.KAFKA_TOPIC,
    messages: JSON.stringify(data)
}]
const send = (data) => data |> createKafkaMsg |> producer.send;
const produce = (data) => {
    producer.on("ready", () => send(data))
}

export default produce;
