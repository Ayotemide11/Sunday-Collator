import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface AttendanceRecord {
  id: string;
  district: string;
  males: number;
  females: number;
  total: number;
  date: string; // YYYY-MM-DD
  serviceType?: string;
  reportedBy?: string;
  stationName?: string;
  remarks?: string;
  createdAt: number;
  updatedAt: number;
}

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'records.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readRecordsFromFile(): AttendanceRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error('Error reading records file:', err);
  }
  return [];
}

function writeRecordsToFile(records: AttendanceRecord[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing records file:', err);
  }
}

// Memory store initialized from disk
let recordsStore: AttendanceRecord[] = readRecordsFromFile();

// Set of connected SSE clients
const sseClients = new Set<express.Response>();

function broadcastUpdate(actionType: string) {
  const payload = JSON.stringify({
    type: actionType,
    records: recordsStore,
    timestamp: Date.now(),
  });

  sseClients.forEach((client) => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      console.error('Error writing to SSE client:', e);
      sseClients.delete(client);
    }
  });
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  // API Routes - Real-time collation endpoints

  // 1. Get all records
  app.get('/api/records', (req, res) => {
    res.json({ records: recordsStore });
  });

  // 2. Add or update record
  app.post('/api/records', (req, res) => {
    const data = req.body;
    if (!data || !data.district || !data.date) {
      res.status(400).json({ error: 'District and date are required' });
      return;
    }

    const maleNum = Math.max(0, Number(data.males) || 0);
    const femaleNum = Math.max(0, Number(data.females) || 0);
    const computedTotal = maleNum + femaleNum;

    if (data.id) {
      // Edit by ID
      recordsStore = recordsStore.map((r) =>
        r.id === data.id
          ? {
              ...r,
              district: data.district,
              males: maleNum,
              females: femaleNum,
              total: computedTotal,
              date: data.date,
              serviceType: data.serviceType || 'AYAC 2026',
              reportedBy: data.reportedBy || '',
              stationName: data.stationName || data.remarks || '',
              remarks: data.stationName || data.remarks || '',
              updatedAt: Date.now(),
            }
          : r
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        district: data.district,
        males: maleNum,
        females: femaleNum,
        total: computedTotal,
        date: data.date,
        serviceType: data.serviceType || 'AYAC 2026',
        reportedBy: data.reportedBy || '',
        stationName: data.stationName || data.remarks || '',
        remarks: data.stationName || data.remarks || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      recordsStore = [newRecord, ...recordsStore];
    }

    writeRecordsToFile(recordsStore);
    broadcastUpdate('upsert');
    res.json({ success: true, records: recordsStore });
  });

  // 3. Delete record
  app.delete('/api/records/:id', (req, res) => {
    const { id } = req.params;
    recordsStore = recordsStore.filter((r) => r.id !== id);
    writeRecordsToFile(recordsStore);
    broadcastUpdate('delete');
    res.json({ success: true, records: recordsStore });
  });

  // 4. Reset figures to zero
  app.post('/api/records/reset', (req, res) => {
    recordsStore = [];
    writeRecordsToFile(recordsStore);
    broadcastUpdate('reset');
    res.json({ success: true, records: recordsStore });
  });

  // 5. Sync batch / migration from client local storage
  app.post('/api/records/sync', (req, res) => {
    const { clientRecords } = req.body;
    if (Array.isArray(clientRecords) && clientRecords.length > 0) {
      // Merge unique records by ID
      const recordMap = new Map<string, AttendanceRecord>();
      recordsStore.forEach((r) => recordMap.set(r.id, r));
      clientRecords.forEach((r) => {
        if (!recordMap.has(r.id)) {
          recordMap.set(r.id, r);
        }
      });
      recordsStore = Array.from(recordMap.values());
      writeRecordsToFile(recordsStore);
      broadcastUpdate('sync');
    }
    res.json({ success: true, records: recordsStore });
  });

  // 6. Real-time Server-Sent Events (SSE) Stream
  app.get('/api/records/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    // Send initial records snapshot
    const initialPayload = JSON.stringify({
      type: 'init',
      records: recordsStore,
      timestamp: Date.now(),
    });
    res.write(`data: ${initialPayload}\n\n`);

    sseClients.add(res);

    // Heartbeat to keep connection alive through proxies
    const keepAliveTimer = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch (err) {
        clearInterval(keepAliveTimer);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAliveTimer);
      sseClients.delete(res);
    });
  });

  // Vite Middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
