/* ── Types ───────────────────────────────────────────── */

export interface EchoRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}

export interface EchoResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  error?: string;
}

/* ── Send Request ────────────────────────────────────── */

export async function sendRequest(req: EchoRequest): Promise<EchoResponse> {
  const start = performance.now();
  try {
    const fetchHeaders = new Headers(req.headers);
    const init: RequestInit = {
      method: req.method,
      headers: fetchHeaders,
    };
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      init.body = req.body;
    }

    const res = await fetch(req.url, init);
    const duration = Math.round(performance.now() - start);
    const resHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => { resHeaders[k] = v; });

    const body = await res.text();

    return {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
      body,
      duration,
    };
  } catch (e: unknown) {
    return {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: '',
      duration: Math.round(performance.now() - start),
      error: (e as Error).message,
    };
  }
}

/* ── Format helpers ──────────────────────────────────── */

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export const STATUS_CODES: { code: number; text: string }[] = [
  { code: 200, text: 'OK' }, { code: 201, text: 'Created' }, { code: 204, text: 'No Content' },
  { code: 301, text: 'Moved Permanently' }, { code: 302, text: 'Found' }, { code: 304, text: 'Not Modified' },
  { code: 400, text: 'Bad Request' }, { code: 401, text: 'Unauthorized' }, { code: 403, text: 'Forbidden' },
  { code: 404, text: 'Not Found' }, { code: 405, text: 'Method Not Allowed' }, { code: 409, text: 'Conflict' },
  { code: 422, text: 'Unprocessable Entity' }, { code: 429, text: 'Too Many Requests' },
  { code: 500, text: 'Internal Server Error' }, { code: 502, text: 'Bad Gateway' }, { code: 503, text: 'Service Unavailable' },
];

export function buildCurl(req: EchoRequest): string {
  let cmd = `curl -X ${req.method}`;
  for (const [k, v] of Object.entries(req.headers)) {
    cmd += ` \\\n  -H '${k}: ${v}'`;
  }
  if (req.body) {
    cmd += ` \\\n  -d '${req.body.replace(/'/g, "\\'")}'`;
  }
  cmd += ` \\\n  '${req.url}'`;
  return cmd;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function getContentType(headers: Record<string, string>): string {
  const ct = Object.entries(headers).find(([k]) => k.toLowerCase() === 'content-type');
  return ct?.[1] ?? 'unknown';
}

export function formatBody(body: string, contentType: string): string {
  if (!body) return '';
  if (contentType.includes('json') || body.trim().startsWith('{') || body.trim().startsWith('[')) {
    try { return JSON.stringify(JSON.parse(body), null, 2); } catch { /* ignore */ }
  }
  return body;
}
