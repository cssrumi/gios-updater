class Measurement {
    constructor(stationName, pm10Value, pm25Value, datetime) {
        this.stataionName = stationName;
        this.pm10Value = pm10Value;
        this.pm25Value = pm25Value;
        this.datetime = datetime;
    }
}

export default Measurement;
