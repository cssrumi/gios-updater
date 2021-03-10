import enumValue from "../common/enum.js";

const Source = Object.freeze({
    GIOS_API: enumValue("GIOS_API"),
    AIRQ_MEASUREMENT: enumValue("AIRQ_MEASUREMENT"),

    parse: function (str) {
        const obj = this.values().filter(value => str === value)[0]
        if (obj === undefined) throw new Error("Invalid Source type")
    },

    values: function () {
        return [this.GIOS_API, this.AIRQ_MEASUREMENT];
    },
});

export default Source;
