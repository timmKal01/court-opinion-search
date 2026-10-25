import { Actor, log } from 'apify';
import { searchCourtListener } from './courtlistener.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const {
    query: queryInput,
    resultType = 'opinions',
    court,
    filedAfter,
    filedBefore,
    maxResults = 20,
    apiToken,
} = input;

// An empty call (an AI agent calling with {}, or an empty API call) searches the input form's example instead of failing.
// `query` deliberately has no schema default (Apify would fill it in before the run starts), so the run can tell this
// fallback apart from someone who searched "antitrust", and every row says which query it answers.
const exampleQuery = !String(queryInput ?? '').trim();
const query = exampleQuery ? 'antitrust' : String(queryInput).trim();
if (exampleQuery) log.info('No query given, so searching the example "antitrust". Each row has exampleQuery: true.');

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const SEARCH_EVENT = 'court-search';

let results = [];
try {
    results = await searchCourtListener({ query, resultType, court, filedAfter, filedBefore, maxResults, apiToken });
} catch (err) {
    log.warning('CourtListener search failed', { query, error: err.message });
}

if (results.length > 0) {
    await Actor.pushData(results.map((r) => ({ query, exampleQuery, ...r })));
}
await Actor.charge({ eventName: SEARCH_EVENT });

log.info('Searched CourtListener', { query, resultType, results: results.length });

await Actor.exit();
