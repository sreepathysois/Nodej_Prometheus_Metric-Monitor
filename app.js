// app.js

const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = 3000;

// Create a Prometheus counter metric
const counter = new promClient.Counter({
  name: 'cafe_welcome_requests_total',
  help: 'Total number of welcome page requests'
});

// Setup default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics();

// Welcome page
app.get('/', (req, res) => {
  counter.inc(); // increment our counter
  res.send('<h1>Welcome to Mom Pop Cafe ☕</h1>');
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(port, () => {
  console.log(`Cafe app running on http://localhost:${port}`);
});

