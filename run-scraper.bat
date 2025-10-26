@echo off
echo Installing dependencies...
npm install

echo Running price scraper with alerts...
node src/scrapers/priceScraper.js

echo Setting up scheduled task...
schtasks /create /tn "PriceScraper" /tr "node \"%~dp0src\scrapers\priceScraper.js\"" /sc minute /mo 30 /f

echo Price scraper scheduled to run every 30 minutes
pause