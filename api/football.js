export default async function handler(req, res) {
  // Uzimamo sve što je prosleđeno kroz query (zahvaljujući vercel.json rewrite-u)
  const { path, ...query } = req.query;

  // Sastavljamo putanju ka spoljnom API-ju
  const pathSegments = Array.isArray(path) ? path.join("/") : (path ?? "");

  const queryString = new URLSearchParams(query).toString();
  const url = `https://api.football-data.org/v4/${pathSegments}${queryString ? `?${queryString}` : ""}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN ?? "",
      },
    });

    const body = await apiRes.text();

    res.status(apiRes.status);
    res.setHeader(
      "Content-Type",
      apiRes.headers.get("content-type") ?? "application/json",
    );
    res.send(body);
  } catch (err) {
    res.status(502).json({ message: "Proxy error", error: String(err) });
  }
}
