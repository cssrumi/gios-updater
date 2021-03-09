const enumValue = (value) => Object.freeze({toString: () => value});

const Sensor = Object.freeze({
    PM2_5: enumValue("PM2.5"),
    PM10: enumValue("PM10"),

    parse: function (str) {
        const obj = this.values().filter(value => str === value)[0]
        if (obj === undefined) throw new Error("Invalid Source type")
    },

    values: function () {
        return [this.PM2_5, this.PM10];
    },
});

export default Sensor;
