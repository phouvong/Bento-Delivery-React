// Proxy endpoint that adds auth headers to the reel stream request.
// This allows the browser's <video> element to make Range requests natively,
// enabling true progressive playback without MSE/blob complexity.
//
// Usage: /api/reels/stream?reel_id=123&t=TOKEN&mid=MODULE_ID&zid=ZONE_ID
//
// The browser handles all buffering, seeking, and Range requests automatically.

export const config = {
  api: {
    // Remove the 4 MB response limit so large videos stream through
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  const { reel_id, t: token, mid: moduleId, zid: zoneid, lang, lat, lng, guest_id } =
    req.query;

  if (!reel_id) {
    return res.status(400).json({ error: "reel_id required" });
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const guestParam = guest_id ? `&guest_id=${guest_id}` : "";
  const upstreamUrl = `${baseUrl}/api/v1/customer/reels/details?reel_id=${reel_id}&stream=1${guestParam}`;

  const upstreamHeaders = {
    Accept: "video/*,*/*",
    "X-software-id": "33571750",
  };

  if (token)    upstreamHeaders["Authorization"]  = `Bearer ${token}`;
  if (moduleId) upstreamHeaders["moduleId"]       = moduleId;
  if (zoneid)   upstreamHeaders["zoneid"]         = zoneid;
  if (lang)     upstreamHeaders["X-localization"] = lang;
  if (lat)      upstreamHeaders["latitude"]       = lat;
  if (lng)      upstreamHeaders["longitude"]      = lng;

  // Every upstream request carries a Range header: forward the browser's own
  // Range if present (for seeks/partial reads), otherwise default to the full
  // file as a single 206 (`bytes=0-`). Server returns 206 Partial Content.
  upstreamHeaders["Range"] = req.headers["range"] || "bytes=0-";

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, { headers: upstreamHeaders });
  } catch (err) {
    return res.status(502).json({ error: "upstream fetch failed" });
  }

  // Forward status (200 or 206 Partial Content)
  res.status(upstream.status);

  // Forward relevant response headers
  const forward = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
  ];
  forward.forEach((h) => {
    const val = upstream.headers.get(h);
    if (val) res.setHeader(h, val);
  });

  // Tell the browser it may cache this in memory but not on disk
  res.setHeader("Cache-Control", "private, no-store");

  // Pipe the upstream body to the response
  if (!upstream.body) return res.end();

  const reader = upstream.body.getReader();
  const pump = () => {
    reader
      .read()
      .then(({ value, done }) => {
        if (done) return res.end();
        res.write(Buffer.from(value));
        pump();
      })
      .catch(() => res.end());
  };
  pump();
}
