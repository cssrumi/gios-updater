import fetch from "node-fetch";
import pRetry from "p-retry";
import Config from "../../config/config.js";
import AesUtil from "./aes-util.js";
import {DateTime} from "luxon";


const aesUtil = new AesUtil(128, 1000);
const iv = 'dc0da04af8fee58593442bf834b30739';
const salt = 'dc0da04af8fee58593442bf834b30739';

export const getAuth = async () => {
    const response = await fetch(Config.GIOS_API);
    if (response.status !== 200) {
        throw new pRetry.AbortError(response.statusText);
    }
    const body = await response.text();
    const uuid = body.match(/window\.csrf = "[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}";/)[0].match(/[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}/)[0];
    return {
        csrfToken: uuid,
        cookies: response.headers.get('set-cookie'),
    };
}

const createStationsOptions = (auth, page = 1) => {
    const date = DateTime.utc().set({
        millisecond: 0,
    });
    return {
        method: 'POST',
        headers: {
            _csrf_token: auth.csrfToken,
            'Content-Type': 'application/json',
            Cookie: auth.cookies,
        },
        body: JSON.stringify({
            ElementsPerPage: 1000,
            Page: page,
            SortBy: 'station.stationCode',
            SortDesc: false,
            Provinces: [],
            Districts: [],
            Communes: [],
            Statuses: [],
            Params: [],
            MeasTypes: [],
            StartDate: date.toISO(),
            EndDate: date.plus({days: 1}).toISO(),
            Zones: [],
        }),
    };

}

export const getStationsPage = async (auth, page = 1) => {
    const stationsOptions = createStationsOptions(auth, page);
    const response = await fetch(`${Config.GIOS_API}/data/findStations`, stationsOptions);
    return await getJsonBody(response, auth);
}

const createSensorDataOptions = (auth, sensorId, date, page) => {
    return {
        method: 'POST',
        headers: {
            _csrf_token: auth.csrfToken,
            'Content-Type': 'application/json',
            Cookie: auth.cookies,
        },
        body: JSON.stringify({
            Page: page,
            StationIds: [sensorId],
            DataType: 'measResults',
            AvgTime: 1,
            AggrType: 'day',
            StartDate: date.startOf('day').toISO(),
            EndDate: date.endOf('day').plus({hours: 1}).toISO(),
        }),
    };
};

export const getSensorDataPage = async (auth, sensorId, date, pageNumber = 1) => {
    const sensorDataOptions = createSensorDataOptions(auth, sensorId, date, pageNumber);
    const response = await fetch(`${Config.GIOS_API}/data/getTableForSelectedStations/${pageNumber}`, sensorDataOptions);
    return await getJsonBody(response, auth);
};

const getJsonBody = async (response, auth) => {
    if (response.status !== 200) {
        throw new pRetry.AbortError(response.statusText);
    }

    const body = await response.text();
    try {
        const decodeData = aesUtil.decrypt(salt, iv, auth.csrfToken, body);
        const jsonBody = (decodeData) ? JSON.parse(decodeData) : {Data: []};
        return (jsonBody.Data) ? jsonBody : {...jsonBody, Data: []};
    } catch (e) {
        console.warn(`Error during deserialization: ${e.message}`);
        return {Data: []};
    }
};
