# Setup FCM Push Notifications

## Bước 1: Tạo Service Account Key
1. Vào Firebase Console → Project Settings → Service Accounts
2. Bấm "Generate new private key" 
3. Tải file JSON về
4. Đổi tên thành `firebase-service-account.json`
5. Đặt vào `D:\Nông Lạc\price-scraper-service\firebase-service-account.json`

## Bước 2: Chạy scraper với FCM
```bash
cd "D:\Nông Lạc\price-scraper-service"
npm install
node src/scrapers/priceScraper.js
```

## Bước 3: Tự động chạy mỗi 30 phút
```bash
run-scraper.bat
```

## Cách hoạt động:
- ✅ **App tắt**: Vẫn nhận push notification
- ✅ **Không cần email**: Chỉ dùng FCM
- ✅ **Tự động**: Scraper chạy định kỳ trên server
- ✅ **Real-time**: Thông báo ngay khi có cảnh báo

**Lưu ý**: Cần file `firebase-service-account.json` để FCM hoạt động!