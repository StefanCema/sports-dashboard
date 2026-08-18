export default async function handler(req, res) {
  // Izvlačimo i "path" i čudni "...path" iz Vercela, ostalo ide u query
  const { path, "...path": spreadPath, ...query } = req.query;

  // Koristimo onaj koji zapravo postoji
  const actualPath = path || spreadPath;
  const pathSegments = Array.isArray(actualPath)
    ? actualPath.join("/")
    : (actualPath ?? "");

  const queryString = new URLSearchParams(query).toString();
  const url = `https://api.football-data.org/v4/${pathSegments}${queryString ? `?${queryString}` : ""}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN ?? "",
      },
    });

    const body = await apiRes.text();

    // Dodaj ovo privremeno da vidiš šta tačno vraća football-data ako pukne
    if (!apiRes.ok) {
      return res.status(502).json({
        error: "External API error",
        status: apiRes.status,
        details: body,
        tokenExists: !!process.env.FOOTBALL_DATA_TOKEN,
      });
    }

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
