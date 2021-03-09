class StationStore {
    #map = Object.freeze(new Map());

    put(stationName, station) {
        this.#map.set(stationName, station)
    }

    get(stationName, fallbackFunction = undefined) {
        const station = this.#map.get(stationName);
        if (!(station === undefined || station === null)) {
            return station;
        }

        if (fallbackFunction === undefined) {
            return null;
        }

        const fallbackStation = fallbackFunction()
        this.put(stationName, fallbackStation);
        return fallbackStation;
    }
}

export default StationStore;
