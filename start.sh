#!/bin/bash

# Price Scraper Service Startup Script for Termux
echo "Starting Price Scraper Service..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing..."
    pkg install nodejs npm
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the service
echo "Starting service on port 3001..."
npm start