import producer from "../config/kafka.js";

const parseMessage = (message) => {
    if (!message.key) return {value: JSON.stringify(message.event)};
    return {key: message.key, value: JSON.stringify(message.event)}
};

export class Message {
    constructor(key, event, topic) {
        this.key = key;
        this.event = event;
        this.topic = topic;
    }

    static keyless(event, topic) {
        return new Message(undefined, event, topic);
    }
}

export const produce = async (message) => {
    if (!message instanceof Message) throw new Error(`Invalid message type.`)
    await producer.send({
        topic: message.topic,
        messages: [parseMessage(message)]
    });
    console.log(`Event send: ${JSON.stringify(message.event)}, on topic: ${message.topic}`);
}
