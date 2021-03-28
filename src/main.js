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
    if (Config.ARCHIVE_PROCESSOR_ENABLED) {
        const archiveProcessor = new ArchiveProcessor(produce, eventFilter)
        await archiveProcessor.process();
    }
    const processor = new Processor(stationList, produce, eventFilter);
    await cron.schedule(Config.CRON, processor.process, undefined);
}

(async () => await main())();
