# Chạy Price Scraper trên Termux Android

## Cài đặt Termux

1. Tải Termux từ F-Droid hoặc GitHub
2. Cập nhật packages:
```bash
pkg update && pkg upgrade
```

## Cài đặt Node.js

```bash
pkg install nodejs npm git
```

## Clone và Setup Project

```bash
# Clone project
git clone https://github.com/YOUR_USERNAME/price-scraper-service.git
cd price-scraper-service

# Cài đặt dependencies
npm install

# Chạy service
npm start
```

## Chạy Background với PM2

```bash
# Cài PM2
npm install -g pm2

# Chạy service với PM2
pm2 start src/index.js --name "price-scraper"

# Xem logs
pm2 logs price-scraper

# Khởi động cùng hệ thống
pm2 startup
pm2 save
```

## Chạy Manual

```bash
# Chạy một lần
npm run scrape

# Chạy development mode
npm run dev
```

## Kiểm tra Service

```bash
# Kiểm tra port
curl http://localhost:3001/health

# Kiểm tra status
curl http://localhost:3001/status

# Chạy scraper thủ công
curl -X POST http://localhost:3001/scrape
```

## Tự động chạy khi khởi động

Tạo file `start.sh`:
```bash
#!/bin/bash
cd /data/data/com.termux/files/home/price-scraper-service
npm start
```

Thêm vào `.bashrc`:
```bash
echo "cd ~/price-scraper-service && npm start" >> ~/.bashrc
```

## Lưu ý Termux

- Service sẽ chạy trên port 3001
- Cần giữ Termux mở để service hoạt động
- Dùng PM2 để chạy background
- Có thể dùng Termux:Boot để tự động khởi động