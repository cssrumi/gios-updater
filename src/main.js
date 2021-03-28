import Config from "./config/config.js";
import {findAllStations} from "./query/query.js";
import cron from "node-cron";
import Processor from "./process/processor.js";
import ArchiveProcessor from "./process/archive-processor.js";
import {eventFilter} from "./process/filter.js";
import {produce} from "./process/producer.js";

const main = async () => {
    const stationList = await findAllStations();
    console.log(`Processing data for: [${stationList}]`)
    // const asyncProducer = async (event) => console.log(JSON.stringify(event));
    const archiveProcessor = new ArchiveProcessor(produce, eventFilter);
    const processor = new Processor(stationList, produce, eventFilter);

    await archiveProcessor.process(Config.OFFSET_POSTGRES);
    await cron.schedule(Config.CRON, processor.process, undefined);
};

(async () => await main())();
