const express = require('express');
const cors    = require('cors');
const path    = require('path');
const crypto  = require('crypto');
const https   = require('https');
const qs      = require('querystring');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

const FLOW_API_KEY    = '56139FB1-5C9B-498E-B5C2-50925LBA0AE3';
const FLOW_SECRET_KEY = '67e2d2f71a1985c061dbf378de076b71abffb179';
const FLOW_URL        = 'https://www.flow.cl/api';

app.use(cors());
app.use(express.json());

// Servir index.html siempre fresco (sin caché)
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname), { etag: false, lastModified: false, setHeaders: (res) => res.setHeader('Cache-Control', 'no-store') }));

function flowSign(params) {
  const keys = Object.keys(params).sort();
  const msg  = keys.map(k => k + params[k]).join('');
  return crypto.createHmac('sha256', FLOW_SECRET_KEY).update(msg).digest('hex');
}

function flowPost(endpoint, params) {
  return new Promise((resolve, reject) => {
    params.apiKey = FLOW_API_KEY;
    params.s      = flowSign(params);
    const body    = qs.stringify(params);
    const options = {
      hostname: 'www.flow.cl',
      path:     `/api/${endpoint}`,
      method:   'POST',
      headers:  { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Respuesta inválida de Flow: ' + data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── PROXY PRODUCTOS (reenvía al backend FastAPI en puerto 8000) ──
app.get('/api/productos', async (req, res) => {
  try {
    const url = 'http://localhost:8000/api/productos' + (req.query.categoria ? `?categoria=${req.query.categoria}` : '');
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Backend no disponible' });
  }
});

// ── INICIAR PAGO FLOW ──
app.post('/api/pago/iniciar', async (req, res) => {
  const { email, items } = req.body;
  if (!email || !items || !items.length) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const total        = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const commerceOrder = `NS-${Date.now()}`;
  try {
    const data = await flowPost('payment/create', {
      commerceOrder,
      subject:         'Pedido Nativa Sur',
      currency:        'CLP',
      amount:          String(total),
      email,
      urlConfirmation: 'http://localhost:3000/api/pago/confirmar',
      urlReturn:       'http://localhost:3000/#pago-ok',
    });
    if (!data.url || !data.token) {
      return res.status(502).json({ error: 'Flow no devolvió URL', detalle: data });
    }
    res.json({ url: `${data.url}?token=${data.token}`, token: data.token });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// ── CONFIRMACIÓN WEBHOOK DE FLOW ──
app.get('/api/pago/confirmar', (req, res) => {
  console.log('Flow confirmó pago, token:', req.query.token);
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', marca: 'Nativa Sur' }));

app.listen(PORT, () => {
  console.log(`\n🌿 Nativa Sur — http://localhost:${PORT}`);
});
