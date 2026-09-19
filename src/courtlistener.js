const BASE = 'https://www.courtlistener.com/api/rest/v4/search/';

export async function searchCourtListener({
    query,
    resultType = 'opinions',
    court,
    filedAfter,
    filedBefore,
    maxResults = 20,
    apiToken,
}) {
    const type = resultType === 'recap_dockets' ? 'r' : 'o';
    const params = new URLSearchParams({
        q: query,
        type,
        order_by: 'score desc',
    });
    if (court) params.set('court', court);
    if (filedAfter) params.set('filed_after', filedAfter);
    if (filedBefore) params.set('filed_before', filedBefore);

    const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; court-opinion-search/0.1)' };
    if (apiToken) headers.Authorization = `Token ${apiToken}`;

    const results = [];
    let url = `${BASE}?${params.toString()}`;

    while (url && results.length < maxResults) {
        const res = await fetch(url, { headers });
        if (!res.ok) {
            throw new Error(`CourtListener request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        for (const r of data.results ?? []) {
            if (results.length >= maxResults) break;
            results.push(normalize(r, type));
        }
        url = data.next && results.length < maxResults ? data.next : null;
    }

    return results;
}

function normalize(r, type) {
    if (type === 'r') {
        return {
            resultType: 'recap_docket',
            caseName: r.caseName ?? null,
            court: r.court ?? null,
            courtId: r.court_id ?? null,
            docketNumber: r.docketNumber ?? null,
            dateFiled: r.dateFiled ?? null,
            absoluteUrl: r.docket_absolute_url ? `https://www.courtlistener.com${r.docket_absolute_url}` : null,
        };
    }
    return {
        resultType: 'opinion',
        caseName: r.caseName ?? null,
        court: r.court ?? null,
        courtId: r.court_id ?? null,
        docketNumber: r.docketNumber ?? null,
        dateFiled: r.dateFiled ?? null,
        citation: r.citation ?? [],
        citeCount: r.citeCount ?? 0,
        judge: r.judge ?? null,
        snippet: r.opinions?.[0]?.snippet?.trim() ?? null,
        downloadUrl: r.opinions?.[0]?.download_url ?? null,
        absoluteUrl: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : null,
    };
}
