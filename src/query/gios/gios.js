import {getAuth, getSensorDataPage, getStationsPage} from './client.js';
import StationStore from './store.js';
import Sensor from '../../common/sensor.js';
import GiosStation from './gios-station.js'
import {DateTime} from 'luxon';
import Config from '../../config/config.js'


const stationStore = new StationStore();

export const getStation = async (stationName, auth = null) => {
    const storeValue = stationStore.get(stationName);
    if (storeValue) return storeValue;
    if (!auth) auth = await getAuth();

    return await getStationFromApi(stationName, auth)
}

const getStationFromApi = async (stationName, auth) => {
    const entireData = await flatMapPagesData(async (page) => getStationsPage(auth, page))
    
    const station = entireData
        .filter(s => s.stationName.localeCompare(stationName, undefined, {sensitivity: 'base'}) === 0)
        .filter(s => s.sensorParamCode == Sensor.PM10 || s.sensorParamCode == Sensor.PM2_5)
        .reduce((acc, curr) => acc.update(curr.sensorParamCode, curr.id), GiosStation.empty(stationName));

    stationStore.put(stationName, station);
    return station;
}

export const getSensorData = async (sensorId, date) => {
    const auth = await getAuth();
    const entireData = await flatMapPagesData(async (page) => getSensorDataPage(auth, sensorId, date, page))
    const dateValidator = (strDate) => DateTime.fromFormat(strDate, 'yyyy-MM-dd HH:mm').setZone(Config.ZONE).ts === date.ts;
    return entireData
        .filter(data => dateValidator(data.dateTo))
        .map(data => data.value)[0];
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
