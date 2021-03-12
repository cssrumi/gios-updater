import Config from "./config/config.js";
import {findAllStations} from "./query/query.js";
import cron from "node-cron";
import Processor from "./process/processor.js";
import {eventFilter} from "./process/filter.js";

const main = async () => {
    const stationList = await findAllStations();
    console.log(`Processing data for: [${stationList}]`)
    const asyncProducer = async (event) => console.log(JSON.stringify(event));
    const processor = new Processor(stationList, asyncProducer, eventFilter);
    await cron.schedule(Config.CRON, processor.process, undefined);
};

(async () => await main())();
