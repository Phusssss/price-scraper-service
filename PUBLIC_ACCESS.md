# Public Access Setup

## Truy cập từ máy khác trong mạng LAN

### 1. Tìm IP của thiết bị Android

**Trên Termux:**
```bash
# Cách 1: Dùng ip command
ip route get 1.1.1.1 | grep -oP 'src \K\S+'

# Cách 2: Dùng ifconfig
ifconfig | grep "inet " | grep -v 127.0.0.1

# Cách 3: Dùng hostname
hostname -I
```

**Trên Android Settings:**
- Settings → Wi-Fi → Connected Network → Advanced → IP Address

### 2. Truy cập từ máy khác

Thay `YOUR_IP` bằng IP thực tế của Android:

```bash
# Health check
curl http://192.168.1.100:3001/health

# Status
curl http://192.168.1.100:3001/status

# Manual scrape
curl -X POST http://192.168.1.100:3001/scrape
```

**Hoặc truy cập từ browser:**
- `http://192.168.1.100:3001/health`
- `http://192.168.1.100:3001/status`

### 3. Truy cập từ Internet (Public)

**Sử dụng ngrok (Recommended):**
```bash
# Cài ngrok trên Termux
pkg install wget
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz
tar -xzf ngrok-v3-stable-linux-arm64.tgz

# Chạy ngrok
./ngrok http 3001
```

**Sử dụng Cloudflare Tunnel:**
```bash
# Cài cloudflared
pkg install cloudflared

# Tạo tunnel
cloudflared tunnel --url http://localhost:3001
```

**Port Forwarding trên Router:**
1. Vào router admin (192.168.1.1)
2. Tìm Port Forwarding/Virtual Server
3. Forward port 3001 → IP Android
4. Truy cập: `http://PUBLIC_IP:3001`

### 4. Bảo mật

**Thêm API Key authentication:**
```javascript
// Trong src/index.js
const API_KEY = process.env.API_KEY || 'your-secret-key';

app.use('/scrape', (req, res, next) => {
  const key = req.headers['x-api-key'] || req.query.key;
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

**Sử dụng:**
```bash
curl -X POST http://YOUR_IP:3001/scrape -H "X-API-Key: your-secret-key"
```

### 5. Kiểm tra kết nối

```bash
# Từ máy khác test kết nối
telnet YOUR_ANDROID_IP 3001

# Hoặc dùng nmap
nmap -p 3001 YOUR_ANDROID_IP
```