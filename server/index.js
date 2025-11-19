require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const { dbPath } = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/data', require('./routes/data'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    app: 'Tracky',
    version: '1.0.0',
    database: dbPath,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Function to open browser
function openBrowser(url) {
  const command = `start "" "${url}"`;
  exec(command, (error) => {
    if (error) {
      console.error('⚠️  Could not open browser automatically.');
      console.log(`📌 Please open manually: ${url}\n`);
    } else {
      console.log('✅ Browser opened!\n');
      console.log('💡 Keep this window open while using Tracky');
      console.log('⚠️  Close this window to stop the server\n');
    }
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n💰 Tracky Server Running!`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`💾 Database: ${dbPath}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log(`\n🌐 Opening in your browser...\n`);
  
  // Auto-open browser after 1 second
  setTimeout(() => {
    openBrowser(`http://localhost:${PORT}`);
  }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down Tracky...');
  server.close(() => {
    console.log('✅ Server closed. Goodbye!\n');
    process.exit(0);
  });
});

// Handle window close
process.on('SIGHUP', () => {
  console.log('Window closed, shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;