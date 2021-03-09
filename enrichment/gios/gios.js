import {getAuth, getSensorDataPage, getStationsPage} from './client.js';
import StationStore from './store.js';
import Sensor from './sensor.js';
import AirqStation from './station.js'
import {DateTime} from 'luxon';


const stationStore = new StationStore();

export const getStation = async (stationName, auth = null) => {
    const storeValue = stationStore.get(stationName);
    if (storeValue !== null && storeValue !== undefined) {
        return storeValue;
    }

    if (auth === null) {
        auth = await getAuth();
    }

    return await getStationFromApi(stationName, auth)
}

const getStationFromApi = async (stationName, auth) => {
    const entireData = await flatMapPagesData(async (page) => getStationsPage(auth, page))
    
    const station = entireData
        .filter(s => s.stationName.localeCompare(stationName, undefined, {sensitivity: 'base'}) === 0)
        .filter(s => s.sensorParamCode == Sensor.PM10 || s.sensorParamCode == Sensor.PM2_5)
        .reduce((acc, curr) => acc.update(curr.sensorParamCode, curr.id), AirqStation.empty(stationName));

    stationStore.put(stationName, station);
    return station;
}

export const getSensorData = async (stationId, date) => {
    const auth = await getAuth();
    const entireData = await flatMapPagesData(async (page) => getSensorDataPage(auth, stationId, date, page))
    const dateValidator = (strDate) => DateTime.fromFormat(strDate, 'yyyy-MM-dd mm:ss').endOf('day').equals(date.endOf('day'));
    return entireData.filter(data => dateValidator(data.dateTo));
}

const flatMapPagesData = async (pageableAsyncCall) => {
    let response = await pageableAsyncCall(1);
    let pageCount = response.PagesCount;
    let page;
    let entireData = response.Data;
    for (page = 2; page <= pageCount; page++) {
        response = await pageableAsyncCall(page)
        pageCount = response.PagesCount;
        entireData = [...entireData, ...response.Data];
    }

    return entireData;
}
