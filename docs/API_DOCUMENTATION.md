# API Documentation - SCADA ESP32 Control System

## Base URL
- Development: `http://localhost:5000`
- Production: `https://yourdomain.com`

## Authentication
Saat ini sistem tidak menggunakan authentication. Untuk production, disarankan menambahkan JWT atau API Key.

## API Endpoints

### 1. System Information

#### GET /api/info
Mendapatkan informasi sistem server.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "uptime": 3600,
    "memory": {
      "rss": 45678592,
      "heapTotal": 25165824,
      "heapUsed": 18234567,
      "external": 1234567
    },
    "esp32Status": "Connected",
    "lastUpdate": "2023-12-24T10:30:00.000Z"
  }
}
```

### 2. Device Status

#### GET /api/status
Mendapatkan status lengkap perangkat.

**Response:**
```json
{
  "success": true,
  "data": {
    "toggles": [false, true, false, true],
    "buttons": [false, false, false, false],
    "sliders": [25, 50, 75, 100],
    "lamps": [false, true, false, true],
    "gauges": [65.5, 850.2],
    "variables": [1234, 28.5],
    "lastUpdate": "2023-12-24T10:30:00.000Z",
    "esp32Connected": true
  },
  "timestamp": "2023-12-24T10:30:00.000Z"
}
```

### 3. Control Endpoints

#### POST /api/toggle/:id
Mengontrol toggle switch.

**Parameters:**
- `id` (path): ID toggle (0-3)

**Request Body:**
```json
{
  "value": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Toggle 1 set to true",
  "data": {
    "id": 0,
    "value": true
  }
}
```

#### POST /api/button/:id
Menekan push button.

**Parameters:**
- `id` (path): ID button (0-3)

**Response:**
```json
{
  "success": true,
  "message": "Button 1 pressed",
  "data": {
    "id": 0
  }
}
```

#### POST /api/slider/:id
Mengatur nilai slider.

**Parameters:**
- `id` (path): ID slider (0-3)

**Request Body:**
```json
{
  "value": 75
}
```

**Response:**
```json
{
  "success": true,
  "message": "Slider 1 set to 75%",
  "data": {
    "id": 0,
    "value": 75
  }
}
```

### 4. Sensor Data

#### GET /api/sensors
Mendapatkan data sensor terkini.

**Response:**
```json
{
  "success": true,
  "data": {
    "gauges": [65.5, 850.2],
    "variables": [1234, 28.5],
    "lamps": [false, true, false, true],
    "esp32Connected": true
  },
  "timestamp": "2023-12-24T10:30:00.000Z"
}
```

### 5. System Control

#### POST /api/reset
Reset semua kontrol ke nilai default.

**Response:**
```json
{
  "success": true,
  "message": "All controls reset to default values"
}
```

## ESP32 Endpoints

### 1. Connection Test

#### GET /esp32/test
Test koneksi ke ESP32.

**Response Success:**
```json
{
  "success": true,
  "message": "ESP32 connection successful",
  "data": {
    "ip": "192.168.1.100",
    "port": 80,
    "response": {
      "status": "ok",
      "message": "ESP32 is alive"
    }
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "ESP32 connection failed",
  "error": "connect ECONNREFUSED 192.168.1.100:80",
  "config": {
    "ip": "192.168.1.100",
    "port": 80
  }
}
```

### 2. ESP32 Status

#### GET /esp32/status
Mendapatkan status dari ESP32.

**Response:**
```json
{
  "success": true,
  "data": {
    "toggles": [false, true, false, true],
    "buttons": [false, false, false, false],
    "sliders": [25, 50, 75, 100],
    "lamps": [false, true, false, true],
    "gauges": [65.5, 850.2],
    "variables": [1234, 28.5],
    "timestamp": 1703419800000,
    "wifi_rssi": -45,
    "free_heap": 234567
  },
  "connection": "Connected"
}
```

### 3. Send Command

#### POST /esp32/command
Mengirim perintah ke ESP32.

**Request Body:**
```json
{
  "type": "toggle",
  "data": {
    "id": 0,
    "value": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Command sent to ESP32",
  "data": {
    "success": true,
    "message": "Command executed"
  }
}
```

### 4. Configuration

#### GET /esp32/config
Mendapatkan konfigurasi ESP32.

**Response:**
```json
{
  "success": true,
  "config": {
    "ip": "192.168.1.100",
    "port": "80",
    "timeout": "5000"
  }
}
```

#### POST /esp32/config
Update konfigurasi ESP32.

**Request Body:**
```json
{
  "ip": "192.168.1.101",
  "port": "80",
  "timeout": "3000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "ESP32 configuration updated",
  "config": {
    "ip": "192.168.1.101",
    "port": "80",
    "timeout": "3000"
  }
}
```

## WebSocket Events

### Client to Server Events

#### toggle_change
Mengubah status toggle.
```javascript
socket.emit('toggle_change', {
  id: 0,
  value: true
});
```

#### button_press
Menekan button.
```javascript
socket.emit('button_press', {
  id: 0
});
```

#### slider_change
Mengubah nilai slider.
```javascript
socket.emit('slider_change', {
  id: 0,
  value: 75
});
```

### Server to Client Events

#### device_state
Update status lengkap perangkat.
```javascript
socket.on('device_state', (data) => {
  console.log('Device state updated:', data);
});
```

#### sensor_update
Update data sensor real-time.
```javascript
socket.on('sensor_update', (data) => {
  console.log('Sensor data:', data);
  // data: { gauges, variables, lamps, timestamp }
});
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Parameter tidak valid |
| 404 | Not Found | Endpoint tidak ditemukan |
| 500 | Internal Server Error | Error server internal |
| 503 | Service Unavailable | ESP32 tidak terhubung |

## Rate Limiting

- API endpoints: 100 requests per 15 menit per IP
- WebSocket connections: 10 connections per IP

## Example Usage

### JavaScript/Fetch
```javascript
// Get device status
const response = await fetch('/api/status');
const data = await response.json();

// Control toggle
await fetch('/api/toggle/0', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ value: true })
});
```

### cURL
```bash
# Get status
curl -X GET http://localhost:5000/api/status

# Control toggle
curl -X POST http://localhost:5000/api/toggle/0 \
  -H "Content-Type: application/json" \
  -d '{"value": true}'

# Test ESP32 connection
curl -X GET http://localhost:5000/esp32/test
```

### Python
```python
import requests

# Get device status
response = requests.get('http://localhost:5000/api/status')
data = response.json()

# Control slider
requests.post('http://localhost:5000/api/slider/0', 
             json={'value': 50})
```

### Arduino (ESP32)
```cpp
// Send status to server
HTTPClient http;
http.begin("http://192.168.1.50:5000/esp32/status");
http.addHeader("Content-Type", "application/json");

String payload = "{\"toggles\":[true,false,true,false]}";
int httpResponseCode = http.POST(payload);

if (httpResponseCode > 0) {
  String response = http.getString();
  Serial.println(response);
}
http.end();
```

## WebSocket Client Example

### JavaScript
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Listen for device state updates
socket.on('device_state', (state) => {
  console.log('Device state:', state);
});

// Send toggle command
socket.emit('toggle_change', { id: 0, value: true });

// Handle connection events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

## Security Considerations

### Production Recommendations:
1. **Authentication**: Implementasi JWT atau API Key
2. **HTTPS**: Gunakan SSL/TLS untuk enkripsi
3. **Rate Limiting**: Batasi request per IP
4. **Input Validation**: Validasi semua input
5. **CORS**: Konfigurasi CORS yang tepat
6. **Firewall**: Batasi akses ke port tertentu

### Example Security Headers:
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```
