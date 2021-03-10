import Sensor from "../../common/sensor.js";

class GiosStation {
    constructor(name, pm10SensorId, pm25SensorId) {
        this.name = name;
        this.pm10SensorId = pm10SensorId;
        this.pm25SensorId = pm25SensorId;
    }

    getSensorId (sensor) {
        switch (sensor) {
            case Sensor.PM10:
            case Sensor.PM10.toString():
                return this.pm10SensorId;
            case Sensor.PM2_5:
            case Sensor.PM2_5.toString():
                return this.pm25SensorId;
            default:
                throw Error("Invalid sensor.")
        }
    }

    update(sensor, value) {
        switch (sensor) {
            case Sensor.PM10:
            case Sensor.PM10.toString():
                this.pm10SensorId = value;
                break;
            case Sensor.PM2_5:
            case Sensor.PM2_5.toString():
                this.pm25SensorId = value;
                break;
            default:
                throw Error("Invalid sensor.")
        }

        return this;
    }

    static empty(name) {
        return new GiosStation(name, null, null);
    }
}

export default GiosStation;
