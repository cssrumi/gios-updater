import enumValue from "./enum.js";

const Sensor = Object.freeze({
    PM2_5: enumValue("PM2.5"),
    PM10: enumValue("PM10"),

    parse: function (rawSensor) {
        console.log(`Parsing: ${rawSensor}`)
        const obj = this.values().filter(sensor => sensor.equals(rawSensor))[0];
        if (!obj) throw new Error(`Invalid Sensor type: ${rawSensor}`);
    },

    values: function () {
        return [this.PM2_5, this.PM10];
    },

    equals: function (sensor) {
        return compareSensors(this, sensor);
    }
});

const compareSensors = (sensor1, sensor2) => {
    const lcs1 = sensor1.toLowerCase();
    const lcs2 = sensor2.toLowerCase();
    if (lcs1 === lcs2) return true;
    if (lcs1.replace('.', '_') === lcs2) return true;
    return lcs1.replace('.', '') === lcs2;
}

export default Sensor;
