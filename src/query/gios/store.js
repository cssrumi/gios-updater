class StationStore {
    #map = Object.freeze(new Map());

    put(stationName, station) {
        this.#map.set(stationName, station)
    }

    get(stationName, fallbackFunction = undefined) {
        const station = this.#map.get(stationName);
        if (station) return station;
        if (!fallbackFunction) return null;

        const fallbackStation = fallbackFunction()
        this.put(stationName, fallbackStation);
        return fallbackStation;
    }
}

export default StationStore;
