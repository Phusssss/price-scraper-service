# Price Scraper Service

Agricultural price scraping service for NôngLạc platform.

## Features

- Scrapes coffee prices from WebGia.com
- Automatic scheduling (every hour)
- Firebase integration
- Docker containerized
- REST API endpoints

## API Endpoints

- `GET /health` - Health check
- `GET /status` - Service status
- `POST /scrape` - Manual scrape trigger

## Docker Usage

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop service
docker-compose down
```

## Manual Usage

```bash
# Install dependencies
npm install

# Run development
npm run dev

# Run production
npm start

# Manual scrape
npm run scrape
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)