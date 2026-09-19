import { Actor, log } from 'apify';
import { searchCourtListener } from './courtlistener.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const {
    query,
    resultType = 'opinions',
    court,
    filedAfter,
    filedBefore,
    maxResults = 20,
    apiToken,
} = input;

if (!query) {
    throw new Error('query is required.');
}

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const SEARCH_EVENT = 'court-search';

let results = [];
try {
    results = await searchCourtListener({ query, resultType, court, filedAfter, filedBefore, maxResults, apiToken });
} catch (err) {
    log.warning('CourtListener search failed', { query, error: err.message });
}

if (results.length > 0) {
    await Actor.pushData(results);
}
await Actor.charge({ eventName: SEARCH_EVENT });

log.info('Searched CourtListener', { query, resultType, results: results.length });

await Actor.exit();
