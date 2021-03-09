import Source from "./source.js";

const queryMap = Object.freeze(new Map([
    [Source.AIRQ_MEASUREMENT, null],
    [Source.GIOS_API, null]
]));

const query = source => {
    if (!(source instanceof Source)) source = Source.parse(source)
    return queryMap.get(source)
}

export default query();
