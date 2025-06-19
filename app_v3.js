// app.js

const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = 3000;

// Prometheus counter for welcome page hits
const counter = new promClient.Counter({
  name: 'cafe_welcome_requests_total',
  help: 'Total number of welcome page requests'
});
promClient.collectDefaultMetrics();

// ============================
// 1️⃣  Request logger middleware
// ============================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [INFO] ${req.method} ${req.originalUrl}`);
  next();
});

// ============================
// 2️⃣  Serve landing page with tabs
// ============================
app.get('/', (req, res) => {
  counter.inc(); // Increment Prometheus counter
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Mom Pop Cafe ☕</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f8f5f0;
          margin: 0;
          padding: 0;
        }
        header {
          background: #6b4f4f;
          color: #fff;
          padding: 30px;
          text-align: center;
        }
        nav {
          background: #ddd;
          display: flex;
          justify-content: center;
        }
        nav button {
          background: #ccc;
          border: none;
          padding: 14px 20px;
          margin: 0 5px;
          cursor: pointer;
          font-size: 16px;
        }
        nav button.active {
          background: #6b4f4f;
          color: #fff;
        }
        main {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px #ccc;
        }
        footer {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        a.metrics {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background: #6b4f4f;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Welcome to Mom Pop Cafe ☕</h1>
        <p>Your friendly neighborhood coffee shop</p>
      </header>

      <nav>
        <button class="tab active" onclick="showTab('welcome')">Welcome</button>
        <button class="tab" onclick="showTab('menu')">Menu</button>
        <button class="tab" onclick="showTab('order')">Order</button>
      </nav>

      <main>
        <section id="welcome" class="tab-content">
          <h2>Welcome!</h2>
          <p>Relax and enjoy freshly brewed coffee and pastries at Mom Pop Cafe.</p>
        </section>

        <section id="menu" class="tab-content" style="display: none;">
          <h2>Menu</h2>
          <p>☕ Coffee, 🥐 Pastries, 🍰 Cakes, and more!</p>
        </section>

        <section id="order" class="tab-content" style="display: none;">
          <h2>Order</h2>
          <p>Place your order at the counter or call us for takeaway!</p>
        </section>

        <a class="metrics" href="/metrics" target="_blank">View Metrics</a>
      </main>

      <footer>
        &copy; ${new Date().getFullYear()} Mom Pop Cafe. All rights reserved.
      </footer>

      <script>
        function showTab(tab) {
          // Hide all sections
          document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
          document.querySelectorAll('nav button').forEach(el => el.classList.remove('active'));
          // Show selected
          document.getElementById(tab).style.display = 'block';
          event.target.classList.add('active');
        }
      </script>
    </body>
    </html>
  `);
});

// ============================
// 3️⃣  Prometheus metrics endpoint with error logging
// ============================
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    console.error(`${new Date().toISOString()} [ERROR] Failed to serve /metrics: ${err.stack}`);
    res.status(500).send('Internal Server Error');
  }
});

// ============================
// 4️⃣  Start server + log to stdout
// ============================
app.listen(port, () => {
  console.log(`${new Date().toISOString()} [INFO] Mom Pop Cafe app running at http://localhost:${port}`);
});

