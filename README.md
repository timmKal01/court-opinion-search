# Court Opinion & Docket Search — CourtListener

Search US federal court opinions or RECAP dockets by keyword, court, and
filing date. Built on the official CourtListener API from the Free Law
Project, the same non-profit source that powers most legal-tech case law
search.

Built for legal researchers, litigation-support and collections teams,
journalists covering court cases, and anyone doing due diligence that needs
to check if a person or company has been party to federal litigation.

## Input

```json
{
  "query": "antitrust",
  "resultType": "opinions",
  "court": "scotus",
  "filedAfter": "2020-01-01",
  "maxResults": 20
}
```

| Field | Type | Description |
|---|---|---|
| `query` | string | Keyword search (case name, party, or legal topic). Leave it empty to search the example `"antitrust"`; every row then has `exampleQuery: true`. |
| `resultType` | string | `"opinions"` (case opinions) or `"recap_dockets"` (federal case filings). |
| `court` | string | Optional CourtListener court ID, e.g. `"scotus"`, `"ca9"`. |
| `filedAfter` / `filedBefore` | string | Optional date range filter (`YYYY-MM-DD`). |
| `maxResults` | integer | Max results to return (default 20). |
| `apiToken` | string | Optional. Your own free CourtListener API token, for a higher rate limit than anonymous access. |

## Output

```json
{
  "query": "antitrust",
  "exampleQuery": false,
  "resultType": "opinion",
  "caseName": "Trump v. Slaughter",
  "court": "Supreme Court of the United States",
  "courtId": "scotus",
  "docketNumber": "25-332",
  "dateFiled": "2026-06-29",
  "citation": [],
  "citeCount": 0,
  "judge": "John G. Roberts",
  "snippet": "...",
  "downloadUrl": "https://www.supremecourt.gov/opinions/25pdf/25-332_qn12.pdf",
  "absoluteUrl": "https://www.courtlistener.com/opinion/10881681/trump-v-slaughter/"
}
```

## How it works

Direct calls to CourtListener's official public REST API
(`courtlistener.com/api/rest/v4/search/`). Works anonymously for casual use;
CourtListener's own rate limits apply, higher volume needs your own free API
token. No proxy, no scraping.

## Pricing note

Billed per **search**, not per result returned — a broad search that returns
200 results costs the same as one that returns 2.

## Related products

- [Insider Trading Tracker](https://apify.com/m_ctim/insider-trading-alert): SEC Form 4 executive buy/sell signals
- [FINRA BrokerCheck Lookup](https://apify.com/m_ctim/finra-brokercheck-lookup): broker/firm registration and disciplinary history
