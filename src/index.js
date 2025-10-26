import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cron from 'node-cron';
import { runPriceScraper } from './scrapers/priceScraper.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manual scrape endpoint
app.post('/scrape', async (req, res) => {
  try {
    const result = await runPriceScraper();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get scraper status
app.get('/status', (req, res) => {
  res.json({
    service: 'Price Scraper Service',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Schedule scraper to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled price scraper...');
  runPriceScraper();
});

app.listen(PORT, () => {
  console.log(`Price Scraper Service running on port ${PORT}`);
  console.log('Scheduled to run every hour');
  
  // Run once on startup
  setTimeout(() => {
    console.log('Running initial scrape...');
    runPriceScraper();
  }, 5000);
});