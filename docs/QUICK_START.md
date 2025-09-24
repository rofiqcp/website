# Quick Start Guide - SCADA ESP32 Control System

## 🚀 Setup dalam 5 Menit

### Prerequisites
- Windows 10/11
- Node.js 14+ ([Download](https://nodejs.org/))
- ESP32 Development Board
- Arduino IDE ([Download](https://www.arduino.cc/en/software))

## Step 1: Install Project

### Otomatis (Recommended)
```bash
# Double-click file ini:
scripts/install.bat
```

### Manual
```bash
# Clone atau download project
git clone <repository-url>
cd scada-esp32-control

# Install dependencies
npm install
cd client && npm install && cd ..

# Setup environment
copy .env.example .env
```

## Step 2: Setup ESP32

### Hardware Wiring (Minimal)
```
ESP32 Pin | Component
----------|----------
GPIO 2    | LED 1 + 220Ω resistor
GPIO 4    | LED 2 + 220Ω resistor  
GPIO 5    | LED 3 + 220Ω resistor
GPIO 18   | LED 4 + 220Ω resistor
3.3V      | VCC
GND       | Ground
```

### Arduino Code
1. Buka Arduino IDE
2. Install ESP32 board package
3. Copy code dari `docs/ESP32_SETUP.md`
4. Edit WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
5. Upload ke ESP32
6. Catat IP address dari Serial Monitor

## Step 3: Configure & Run

### Edit Configuration
```bash
# Edit file .env
ESP32_IP=192.168.1.100  # IP dari ESP32
ESP32_PORT=80
```

### Start Application
```bash
# Double-click file ini:
scripts/start.bat

# Atau manual:
npm run dev
```

### Access Application
- Web Interface: http://localhost:3000
- API Server: http://localhost:5000

## Step 4: Test System

### 1. Check Connection
- Buka Settings tab
- Klik "Test Koneksi"
- Status harus "Connected"

### 2. Test Controls
- Toggle switches → LED di ESP32 menyala/mati
- Push buttons → Lihat response di Serial Monitor
- Sliders → Nilai berubah real-time

### 3. Monitor Data
- Gauge meters menampilkan data simulasi
- Variable boxes update otomatis
- Lamp indicators mengikuti toggle status

## 🎯 Features Overview

### Input Controls
- **4 Toggle Switches**: ON/OFF control
- **4 Push Buttons**: Momentary actions  
- **4 Sliders**: 0-100% value control

### Output Displays
- **4 Lamp Indicators**: Visual status
- **2 Gauge Meters**: Circular progress displays
- **2 Variable Boxes**: Numeric value display

### System Features
- **Real-time Updates**: WebSocket communication
- **Settings Panel**: ESP32 configuration
- **Responsive Design**: Works on mobile/tablet
- **Dark Theme**: Modern UI design

## 🔧 Common Issues & Solutions

### ESP32 Won't Connect
```cpp
// Check Serial Monitor output
// Verify WiFi credentials
// Ensure ESP32 and PC on same network
```

### Web App Can't Connect to ESP32
```bash
# Check ESP32 IP in Serial Monitor
# Update .env file with correct IP
# Test: ping 192.168.1.100
```

### Port Already in Use
```bash
# Change ports in .env:
PORT=5001
# Or kill existing process
```

### Dependencies Error
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules client/node_modules
npm run install-all
```

## 📱 Mobile Access

### Same Network
- Connect phone to same WiFi
- Open browser: `http://YOUR_PC_IP:3000`

### Find PC IP Address
```bash
ipconfig | findstr IPv4
# Use this IP instead of localhost
```

## 🚀 Production Deployment

### Build for Production
```bash
scripts/build.bat
```

### Deploy Options
1. **Netlify**: Automatic GitHub deployment
2. **Heroku**: Cloud hosting
3. **Docker**: Containerized deployment
4. **Local Server**: Run on dedicated PC

See `docs/DEPLOYMENT.md` for detailed instructions.

## 📚 Next Steps

### Customize Your System
1. **Add Real Sensors**: Replace simulated data
2. **Control Relays**: Add external device control
3. **Data Logging**: Store historical data
4. **User Authentication**: Add login system
5. **Mobile App**: Create native mobile interface

### Learn More
- 📖 [Full Documentation](README.md)
- 🔌 [ESP32 Setup Guide](docs/ESP32_SETUP.md)
- 🌐 [API Documentation](docs/API_DOCUMENTATION.md)
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md)
- 🔧 [Troubleshooting](docs/TROUBLESHOOTING.md)

## 💡 Tips & Tricks

### Development
```bash
# Hot reload for faster development
npm run dev

# Check logs for debugging
tail -f logs/app.log

# Test API endpoints
curl http://localhost:5000/api/status
```

### Production
```bash
# Optimize for production
NODE_ENV=production npm start

# Monitor performance
npm install -g pm2
pm2 start server/index.js --name scada
```

### Security
```bash
# Change default ports
# Use HTTPS in production
# Add authentication
# Configure firewall
```

## 🆘 Need Help?

### Quick Diagnostics
```bash
# Check system status
node --version
npm --version
ping localhost

# Test ESP32 connection
curl http://192.168.1.100/ping
```

### Get Support
1. Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Review error messages in browser console
3. Check Serial Monitor for ESP32 issues
4. Verify network connectivity

### Report Issues
Include this information:
- Operating System
- Node.js version
- Error messages
- Steps to reproduce
- ESP32 Serial Monitor output

---

**🎉 Congratulations!** 
Your SCADA ESP32 Control System is now ready to use!
