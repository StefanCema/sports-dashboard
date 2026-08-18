// Vercel serverless funkcija — produkcijska zamena za dev-only proxy iz
// vite.config.ts. Isti posao: primi poziv sa frontenda na /api/football/*,
// prosledi ga na api.football-data.org SERVER-SIDE (Vercel-ov server, ne
// browser), gde CORS ogranicenje ne vazi, i doda X-Auth-Token ovde umesto
// u browseru.
//
// VAZNO: token ovde NIJE VITE_-prefiksovan (FOOTBALL_DATA_TOKEN, ne
// VITE_FOOTBALL_DATA_TOKEN) — VITE_ prefiks bi ga ubacio u frontend bundle
// i izlozio ga svakom ko otvori Network tab. Ovde ostaje iskljucivo
// server-side, sto je bezbednije nego lokalni dev proxy setup.
//
// Postavlja se u Vercel dashboard-u: Project Settings -> Environment
// Variables -> FOOTBALL_DATA_TOKEN, NE u .env fajlu (taj se i ne pushuje na git).

export default async function handler(req, res) {
  const { path, ...query } = req.query;
  const pathSegments = Array.isArray(path) ? path.join('/') : (path ?? '');

  const queryString = new URLSearchParams(query).toString();
  const url = `https://api.football-data.org/v4/${pathSegments}${queryString ? `?${queryString}` : ''}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN ?? '',
      },
    });

    const body = await apiRes.text();
    res.status(apiRes.status);
    res.setHeader('Content-Type', apiRes.headers.get('content-type') ?? 'application/json');
    res.send(body);
  } catch (err) {
    res.status(502).json({ message: 'Proxy error', error: String(err) });
  }
}
