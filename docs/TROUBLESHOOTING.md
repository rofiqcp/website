# Troubleshooting Guide - SCADA ESP32 Control System

## Daftar Isi
1. [Installation Issues](#installation-issues)
2. [Connection Problems](#connection-problems)
3. [ESP32 Issues](#esp32-issues)
4. [Performance Problems](#performance-problems)
5. [Common Error Messages](#common-error-messages)
6. [Debug Tools](#debug-tools)

## Installation Issues

### Node.js Version Compatibility
**Problem:** Error saat install dependencies
```
npm ERR! engine Unsupported engine
```

**Solution:**
```bash
# Check Node.js version
node --version

# Install Node.js 14+ dari https://nodejs.org/
# Atau gunakan nvm (Node Version Manager)
nvm install 18
nvm use 18
```

### Permission Errors (Windows)
**Problem:** EACCES permission denied
```bash
# Run as Administrator
# Atau set npm prefix
npm config set prefix "C:\Users\{Username}\AppData\Roaming\npm"
```

### Port Already in Use
**Problem:** Port 3000 atau 5000 sudah digunakan
```bash
# Check port usage
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Atau ubah port di .env
PORT=5001
```

## Connection Problems

### WebSocket Connection Failed
**Problem:** Real-time updates tidak berfungsi

**Diagnosis:**
1. Check browser console untuk error
2. Verify server running di port yang benar
3. Check firewall settings

**Solution:**
```javascript
// Fallback ke polling jika WebSocket gagal
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling']
});
```

### CORS Errors
**Problem:** Cross-Origin Request Blocked

**Solution:**
```javascript
// server/index.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### Network Connectivity
**Problem:** Cannot connect to server

**Diagnosis:**
```bash
# Test server connectivity
ping localhost
telnet localhost 5000

# Check if server is running
curl http://localhost:5000/api/info
```

## ESP32 Issues

### ESP32 Not Connecting to WiFi
**Problem:** ESP32 tidak dapat connect ke WiFi

**Diagnosis:**
1. Check Serial Monitor output
2. Verify SSID dan password
3. Check WiFi signal strength

**Solution:**
```cpp
// Add debug output
Serial.print("Connecting to ");
Serial.println(ssid);
Serial.print("WiFi status: ");
Serial.println(WiFi.status());

// Add timeout
int attempts = 0;
while (WiFi.status() != WL_CONNECTED && attempts < 20) {
  delay(500);
  Serial.print(".");
  attempts++;
}

if (WiFi.status() != WL_CONNECTED) {
  Serial.println("WiFi connection failed!");
  // Restart ESP32
  ESP.restart();
}
```

### ESP32 IP Address Issues
**Problem:** IP address berubah setelah restart

**Solution:**
```cpp
// Set static IP
IPAddress local_IP(192, 168, 1, 100);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

if (!WiFi.config(local_IP, gateway, subnet)) {
  Serial.println("STA Failed to configure");
}
```

### HTTP Request Timeout
**Problem:** Request ke ESP32 timeout

**Solution:**
```cpp
// Increase server timeout
server.setTimeout(10000); // 10 seconds

// Add watchdog timer
#include "esp_task_wdt.h"

void setup() {
  // Configure watchdog
  esp_task_wdt_init(30, true); // 30 seconds timeout
  esp_task_wdt_add(NULL);
}

void loop() {
  esp_task_wdt_reset(); // Reset watchdog
  server.handleClient();
  // ... other code
}
```

### Memory Issues
**Problem:** ESP32 crash atau restart random

**Diagnosis:**
```cpp
void printMemoryInfo() {
  Serial.printf("Free heap: %d bytes\n", ESP.getFreeHeap());
  Serial.printf("Largest free block: %d bytes\n", heap_caps_get_largest_free_block(MALLOC_CAP_8BIT));
  Serial.printf("Min free heap: %d bytes\n", ESP.getMinFreeHeap());
}
```

**Solution:**
```cpp
// Reduce JSON buffer size
DynamicJsonDocument doc(512); // Instead of 1024

// Free memory periodically
if (ESP.getFreeHeap() < 10000) {
  Serial.println("Low memory, restarting...");
  ESP.restart();
}
```

## Performance Problems

### Slow Response Times
**Problem:** Web interface lambat merespons

**Diagnosis:**
1. Check network latency
2. Monitor server CPU usage
3. Check database queries

**Solution:**
```javascript
// Add request timeout
axios.defaults.timeout = 5000;

// Implement caching
const cache = new Map();
const getCachedData = (key, fetchFn, ttl = 5000) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return Promise.resolve(cached.data);
  }
  
  return fetchFn().then(data => {
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  });
};
```

### High Memory Usage
**Problem:** Server menggunakan memory berlebihan

**Diagnosis:**
```bash
# Monitor memory usage
npm install -g clinic
clinic doctor -- node server/index.js
```

**Solution:**
```javascript
// Limit WebSocket connections
const maxConnections = 100;
let connectionCount = 0;

io.on('connection', (socket) => {
  if (connectionCount >= maxConnections) {
    socket.disconnect();
    return;
  }
  connectionCount++;
  
  socket.on('disconnect', () => {
    connectionCount--;
  });
});
```

### Database Performance
**Problem:** Slow database queries

**Solution:**
```javascript
// Add indexes
db.collection('logs').createIndex({ timestamp: -1 });

// Limit query results
const logs = await db.collection('logs')
  .find()
  .sort({ timestamp: -1 })
  .limit(100)
  .toArray();

// Use aggregation for complex queries
const stats = await db.collection('logs').aggregate([
  { $match: { timestamp: { $gte: startDate } } },
  { $group: { _id: null, avgValue: { $avg: '$value' } } }
]).toArray();
```

## Common Error Messages

### "Cannot read property of undefined"
**Problem:** JavaScript runtime error

**Solution:**
```javascript
// Add null checks
const value = data?.sensors?.temperature || 0;

// Use optional chaining
if (deviceState?.toggles?.[0]) {
  // Safe to access
}
```

### "ECONNREFUSED"
**Problem:** Connection refused to server/ESP32

**Solution:**
1. Check if target service is running
2. Verify IP address and port
3. Check firewall rules
4. Test with telnet or curl

### "JSON Parse Error"
**Problem:** Invalid JSON response

**Solution:**
```javascript
// Add error handling
try {
  const data = JSON.parse(response);
  return data;
} catch (error) {
  console.error('JSON parse error:', error);
  console.log('Raw response:', response);
  return null;
}
```

### "WebSocket Connection Failed"
**Problem:** Real-time communication tidak berfungsi

**Solution:**
```javascript
// Add connection retry logic
const connectWithRetry = () => {
  const socket = io('http://localhost:5000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000
  });
  
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    setTimeout(connectWithRetry, 5000);
  });
  
  return socket;
};
```

## Debug Tools

### Browser Developer Tools
```javascript
// Enable debug mode
localStorage.setItem('debug', 'socket.io-client:*');

// Monitor WebSocket traffic
// Network tab -> WS filter

// Check console for errors
console.log('Debug info:', {
  connected: socket.connected,
  id: socket.id,
  transport: socket.io.engine.transport.name
});
```

### Server Debugging
```javascript
// Add debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Log WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.onAny((event, ...args) => {
    console.log('WebSocket event:', event, args);
  });
});
```

### ESP32 Debugging
```cpp
// Enable debug output
#define DEBUG 1

#if DEBUG
  #define DEBUG_PRINT(x) Serial.print(x)
  #define DEBUG_PRINTLN(x) Serial.println(x)
#else
  #define DEBUG_PRINT(x)
  #define DEBUG_PRINTLN(x)
#endif

// Monitor heap memory
void monitorMemory() {
  static unsigned long lastCheck = 0;
  if (millis() - lastCheck > 10000) { // Every 10 seconds
    DEBUG_PRINT("Free heap: ");
    DEBUG_PRINTLN(ESP.getFreeHeap());
    lastCheck = millis();
  }
}
```

### Network Debugging
```bash
# Monitor network traffic
wireshark

# Check port usage
netstat -tulpn | grep :5000

# Test HTTP endpoints
curl -v http://localhost:5000/api/status

# Test WebSocket
wscat -c ws://localhost:5000/socket.io/?EIO=4&transport=websocket
```

## Performance Monitoring

### Server Monitoring
```javascript
// Add performance monitoring
const startTime = process.hrtime();

app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] * 1000 + diff[1] * 1e-6;
    console.log(`${req.method} ${req.path} - ${duration.toFixed(2)}ms`);
  });
  
  next();
});
```

### Client Monitoring
```javascript
// Monitor render performance
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Performance:', entry.name, entry.duration);
  }
});
observer.observe({ entryTypes: ['measure'] });

// Measure component render time
performance.mark('component-start');
// ... component render
performance.mark('component-end');
performance.measure('component-render', 'component-start', 'component-end');
```

## Recovery Procedures

### System Recovery
```bash
# Stop all services
npm run stop

# Clear cache
npm cache clean --force
rm -rf node_modules
rm -rf client/node_modules

# Reinstall
npm run install-all

# Reset configuration
cp .env.example .env

# Restart services
npm run dev
```

### Database Recovery
```bash
# Backup current data
mongodump --db scada --out backup_$(date +%Y%m%d)

# Restore from backup
mongorestore --db scada --drop backup_20231224/scada

# Rebuild indexes
mongo scada --eval "db.logs.reIndex()"
```

### ESP32 Recovery
```cpp
// Factory reset function
void factoryReset() {
  Serial.println("Performing factory reset...");
  
  // Clear EEPROM
  EEPROM.begin(512);
  for (int i = 0; i < 512; i++) {
    EEPROM.write(i, 0);
  }
  EEPROM.commit();
  
  // Reset WiFi settings
  WiFi.disconnect(true);
  
  // Restart
  ESP.restart();
}
```

## Getting Help

### Log Files Location
- Server logs: `logs/app.log`
- Nginx logs: `logs/nginx/`
- System logs: Check system event viewer

### Useful Commands
```bash
# Check system status
npm run status

# View logs
tail -f logs/app.log

# Test all endpoints
npm run test

# Generate system report
npm run report
```

### Support Information
Saat meminta bantuan, sertakan:
1. Error message lengkap
2. System information (OS, Node.js version)
3. Steps to reproduce
4. Log files yang relevan
5. Network configuration (untuk ESP32 issues)
