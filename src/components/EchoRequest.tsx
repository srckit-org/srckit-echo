import { useState } from 'react';
import {
  TextField, Paper, Typography, Button, Chip, MenuItem, Select, FormControl, InputLabel,
  IconButton, Tooltip, Alert, LinearProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest, HTTP_METHODS, buildCurl, formatBytes, getContentType, formatBody, type EchoRequest } from '../utils/echoUtils';

export default function EchoRequest() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://httpbin.org/anything');
  const [headers, setHeaders] = useState<[string, string][]>([['Accept', 'application/json']]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Awaited<ReturnType<typeof sendRequest>> | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCurl, setShowCurl] = useState(false);

  const addHeader = () => setHeaders(h => [...h, ['', '']]);
  const removeHeader = (i: number) => setHeaders(h => h.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 0 | 1, val: string) => {
    setHeaders(h => h.map((pair, idx) => idx === i ? (field === 0 ? [val, pair[1]] as [string, string] : [pair[0], val] as [string, string]) : pair));
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    const headerObj: Record<string, string> = {};
    headers.forEach(([k, v]) => { if (k.trim()) headerObj[k.trim()] = v; });
    const req: EchoRequest = { method, url, headers: headerObj, body };
    const res = await sendRequest(req);
    setResponse(res);
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const ct = response && !response.error ? getContentType(response.headers) : '';

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>Request Echo</Typography>
      <Typography variant="body2" color="text.secondary" className="mb-4">
        Send HTTP requests and inspect the full response. Requests go to the target URL directly from your browser.
      </Typography>

      {/* URL bar */}
      <div className="flex items-center gap-2 mb-3">
        <FormControl size="small" className="w-28">
          <InputLabel>Method</InputLabel>
          <Select value={method} label="Method" onChange={e => setMethod(e.target.value)}>
            {HTTP_METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField value={url} onChange={e => setUrl(e.target.value)} size="small" fullWidth className="font-mono" slotProps={{ htmlInput: { className: 'font-mono text-sm' } }} placeholder="https://httpbin.org/anything" />
        <Button variant="contained" startIcon={<SendIcon />} onClick={handleSend} disabled={loading || !url}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>

      {loading && <LinearProgress className="mb-3" />}

      {/* Headers */}
      <Paper variant="outlined" className="p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Headers</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addHeader}>Add</Button>
        </div>
        {headers.map((h, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <TextField value={h[0]} onChange={e => updateHeader(i, 0, e.target.value)} size="small" placeholder="Key" className="flex-1 font-mono" slotProps={{ htmlInput: { className: 'font-mono text-xs' } }} />
            <TextField value={h[1]} onChange={e => updateHeader(i, 1, e.target.value)} size="small" placeholder="Value" className="flex-[2] font-mono" slotProps={{ htmlInput: { className: 'font-mono text-xs' } }} />
            <IconButton size="small" onClick={() => removeHeader(i)} disabled={headers.length === 1}><DeleteIcon fontSize="small" /></IconButton>
          </div>
        ))}
      </Paper>

      {/* Body */}
      {(method !== 'GET' && method !== 'HEAD') && (
        <TextField label="Request Body" multiline minRows={4} maxRows={12}
          value={body} onChange={e => setBody(e.target.value)}
          fullWidth variant="outlined" className="font-mono mb-3"
          slotProps={{ htmlInput: { className: 'font-mono text-sm' } }}
          placeholder='{"key": "value"}' />
      )}

      {/* cURL toggle */}
      <Button variant="text" size="small" onClick={() => setShowCurl(c => !c)} className="mb-3">
        {showCurl ? 'Hide' : 'Show'} cURL command
      </Button>

      {showCurl && (
        <Paper variant="outlined" className="p-3 mb-3 bg-gray-100">
          <div className="flex items-center justify-between mb-1">
            <Typography variant="caption" color="text.secondary">cURL equivalent</Typography>
            <IconButton size="small" onClick={() => handleCopy(buildCurl({ method, url, headers: Object.fromEntries(headers.filter(([k]) => k.trim()).map(([k, v]) => [k, v])), body }))}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </div>
          <pre className="m-0 text-xs font-mono whitespace-pre-wrap">{buildCurl({ method, url, headers: Object.fromEntries(headers.filter(([k]) => k.trim()).map(([k, v]) => [k, v])), body })}</pre>
        </Paper>
      )}

      {/* Response */}
      {response && (
        <Paper variant="outlined" className="p-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Chip label={`${response.status} ${response.statusText}`} size="small"
              color={response.status >= 200 && response.status < 300 ? 'success' : response.status >= 400 ? 'error' : 'warning'} />
            <Chip label={`${response.duration}ms`} size="small" variant="outlined" />
            <Chip label={formatBytes(response.body.length)} size="small" variant="outlined" />
            <div className="flex-1" />
            <Tooltip title={copied ? 'Copied!' : 'Copy response body'}>
              <IconButton size="small" onClick={() => handleCopy(formatBody(response.body, ct))}><ContentCopyIcon fontSize="small" /></IconButton>
            </Tooltip>
          </div>

          {response.error && <Alert severity="error" className="mb-3">{response.error}</Alert>}

          {/* Response Headers */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} gutterBottom>Response Headers</Typography>
          <Paper variant="outlined" className="p-2 mb-3 max-h-40 overflow-auto">
            {Object.entries(response.headers).map(([k, v]) => (
              <div key={k} className="text-xs font-mono"><span className="text-blue-600">{k}</span>: {v}</div>
            ))}
          </Paper>

          {/* Response Body */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} gutterBottom>Response Body</Typography>
          <Paper variant="outlined" className="p-3 bg-gray-100 max-h-96 overflow-auto">
            <pre className="m-0 text-xs font-mono whitespace-pre-wrap">{formatBody(response.body, ct) || '(empty)'}</pre>
          </Paper>
        </Paper>
      )}

      {!response && !loading && (
        <Paper variant="outlined" className="p-8 text-center">
          <Typography color="text.secondary">Configure a request and click <strong>Send</strong> to see the echoed response.</Typography>
        </Paper>
      )}
    </div>
  );
}
