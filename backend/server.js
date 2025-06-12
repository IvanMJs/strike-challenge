// Basic Express backend for Vulnerability Manager
import express from 'express';
import cors from 'cors';
import { STATES } from './utils/constants.js';
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory store for vulnerabilities
let vulnerabilities = [];
let idCounter = 1;

// GET all vulnerabilities
app.get('/api/vulnerabilities', (req, res) => {
  res.json(vulnerabilities);
});

// GET a single vulnerability
app.get('/api/vulnerabilities/:id', (req, res) => {
  const vuln = vulnerabilities.find(v => v.id === parseInt(req.params.id));
  if (!vuln) return res.status(404).json({ error: 'Not found' });
  res.json(vuln);
});

// CREATE a vulnerability
app.post('/api/vulnerabilities', (req, res) => {
  const { title, description, criticality, cwe, suggestedFix, status } = req.body;
  if (!title || !status || !STATES.includes(status)) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const vuln = {
    id: idCounter++,
    title,
    description,
    criticality,
    cwe,
    suggestedFix,
    status,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  vulnerabilities.push(vuln);
  res.status(201).json(vuln);
});

// UPDATE a vulnerability
app.put('/api/vulnerabilities/:id', (req, res) => {
  const vuln = vulnerabilities.find(v => v.id === parseInt(req.params.id));
  if (!vuln) return res.status(404).json({ error: 'Not found' });
  const { title, description, criticality, cwe, suggestedFix, status } = req.body;
  if (status && !STATES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  vuln.title = title ?? vuln.title;
  vuln.description = description ?? vuln.description;
  vuln.criticality = criticality ?? vuln.criticality;
  vuln.cwe = cwe ?? vuln.cwe;
  vuln.suggestedFix = suggestedFix ?? vuln.suggestedFix;
  vuln.status = status ?? vuln.status;
  vuln.updatedAt = new Date();
  res.json(vuln);
});

// DELETE a vulnerability
app.delete('/api/vulnerabilities/:id', (req, res) => {
  const idx = vulnerabilities.findIndex(v => v.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  vulnerabilities.splice(idx, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Vulnerability Manager API running on http://localhost:${PORT}`);
});
