import { useState } from 'react';
import {
  TextField, Paper, Typography, Chip, IconButton, Tooltip, MenuItem, Select, FormControl, InputLabel,
  Button,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { STATUS_CODES } from '../utils/echoUtils';

export default function EchoResponseBuilder() {
  const [statusCode, setStatusCode] = useState(200);
  const [headers, setHeaders] = useState<[string, string][]>([['Content-Type', 'application/json']]);
  const [body, setBody] = useState('{\n  "message": "Hello, World!",\n  "timestamp": "2024-01-01T00:00:00Z"\n}');
  const [copied, setCopied] = useState(false);

  const addHeader = () => setHeaders(h => [...h, ['', '']]);
  const removeHeader = (i: number) => setHeaders(h => h.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 0 | 1, val: string) => {
    setHeaders(h => h.map((pair, idx) => idx === i ? (field === 0 ? [val, pair[1]] as [string, string] : [pair[0], val] as [string, string]) : pair));
  };

  const selectedStatus = STATUS_CODES.find(s => s.code === statusCode);

  const buildRawResponse = () => {
    const lines = [`HTTP/1.1 ${statusCode} ${selectedStatus?.text ?? 'OK'}`];
    headers.forEach(([k, v]) => { if (k.trim()) lines.push(`${k.trim()}: ${v}`); });
    lines.push('');
    lines.push(body);
    return lines.join('\r\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildRawResponse()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>Response Builder</Typography>
      <Typography variant="body2" color="text.secondary" className="mb-4">
        Build a mock HTTP response. Useful for testing webhook handlers, API clients, and debugging.
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Configuration */}
        <Paper variant="outlined" className="p-4 space-y-3">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Configuration</Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Status Code</InputLabel>
            <Select value={statusCode} label="Status Code" onChange={e => setStatusCode(Number(e.target.value))}>
              {STATUS_CODES.map(s => (
                <MenuItem key={s.code} value={s.code}>{s.code} — {s.text}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex items-center justify-between">
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Response Headers</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addHeader}>Add</Button>
          </div>
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">
              <TextField value={h[0]} onChange={e => updateHeader(i, 0, e.target.value)} size="small" placeholder="Key" className="flex-1 font-mono" slotProps={{ htmlInput: { className: 'font-mono text-xs' } }} />
              <TextField value={h[1]} onChange={e => updateHeader(i, 1, e.target.value)} size="small" placeholder="Value" className="flex-[2] font-mono" slotProps={{ htmlInput: { className: 'font-mono text-xs' } }} />
              <IconButton size="small" onClick={() => removeHeader(i)} disabled={headers.length === 1}><DeleteIcon fontSize="small" /></IconButton>
            </div>
          ))}
        </Paper>

        {/* Body */}
        <Paper variant="outlined" className="p-4">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>Response Body</Typography>
          <TextField multiline minRows={12} maxRows={24} value={body} onChange={e => setBody(e.target.value)}
            fullWidth variant="outlined" className="font-mono"
            slotProps={{ htmlInput: { className: 'font-mono text-sm' } }} />
        </Paper>
      </div>

      {/* Preview */}
      <Paper variant="outlined" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Raw Response Preview</Typography>
          <div className="flex items-center gap-2">
            <Chip label={`${statusCode} ${selectedStatus?.text ?? ''}`} size="small" color={statusCode < 400 ? 'success' : 'error'} />
            <Tooltip title={copied ? 'Copied!' : 'Copy raw response'}>
              <IconButton size="small" onClick={handleCopy}><ContentCopyIcon fontSize="small" /></IconButton>
            </Tooltip>
          </div>
        </div>
        <Paper variant="outlined" className="p-3 bg-gray-100 max-h-96 overflow-auto">
          <pre className="m-0 text-xs font-mono whitespace-pre-wrap">{buildRawResponse()}</pre>
        </Paper>
      </Paper>
    </div>
  );
}
