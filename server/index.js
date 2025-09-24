const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Import routes
const apiRoutes = require('./routes/api');
const esp32Routes = require('./routes/esp32');

// Routes
app.use('/api', apiRoutes);
app.use('/esp32', esp32Routes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Global state untuk menyimpan status perangkat
global.deviceState = {
  toggles: [false, false, false, false],
  buttons: [false, false, false, false],
  sliders: [0, 0, 0, 0],
  lamps: [false, false, false, false],
  gauges: [0, 0],
  variables: [0, 0],
  lastUpdate: new Date(),
  esp32Connected: false
};

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current state to new client
  socket.emit('device_state', global.deviceState);
  
  // Handle control changes from client
  socket.on('toggle_change', (data) => {
    const { id, value } = data;
    if (id >= 0 && id < 4) {
      global.deviceState.toggles[id] = value;
      global.deviceState.lastUpdate = new Date();
      
      // Broadcast to all clients
      io.emit('device_state', global.deviceState);
      
      // Send to ESP32 (implement ESP32 communication here)
      sendToESP32('toggle', { id, value });
    }
  });
  
  socket.on('button_press', (data) => {
    const { id } = data;
    if (id >= 0 && id < 4) {
      global.deviceState.buttons[id] = true;
      global.deviceState.lastUpdate = new Date();
      
      // Broadcast to all clients
      io.emit('device_state', global.deviceState);
      
      // Send to ESP32
      sendToESP32('button', { id });
      
      // Reset button state after 100ms
      setTimeout(() => {
        global.deviceState.buttons[id] = false;
        io.emit('device_state', global.deviceState);
      }, 100);
    }
  });
  
  socket.on('slider_change', (data) => {
    const { id, value } = data;
    if (id >= 0 && id < 4) {
      global.deviceState.sliders[id] = value;
      global.deviceState.lastUpdate = new Date();
      
      // Broadcast to all clients
      io.emit('device_state', global.deviceState);
      
      // Send to ESP32
      sendToESP32('slider', { id, value });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Function to send commands to ESP32
async function sendToESP32(type, data) {
  try {
    const axios = require('axios');
    const esp32Url = `http://${process.env.ESP32_IP || '192.168.1.100'}:${process.env.ESP32_PORT || 80}`;
    
    const response = await axios.post(`${esp32Url}/control`, {
      type,
      data
    }, {
      timeout: parseInt(process.env.ESP32_TIMEOUT) || 5000
    });
    
    console.log('Command sent to ESP32:', type, data);
    global.deviceState.esp32Connected = true;
    
  } catch (error) {
    console.error('Error sending to ESP32:', error.message);
    global.deviceState.esp32Connected = false;
  }
}

// Simulate sensor data updates (replace with actual ESP32 data)
setInterval(() => {
  // Simulate gauge values
  global.deviceState.gauges[0] = Math.random() * 100;
  global.deviceState.gauges[1] = Math.random() * 100;
  
  // Simulate variable values
  global.deviceState.variables[0] = Math.floor(Math.random() * 1000);
  global.deviceState.variables[1] = (Math.random() * 50).toFixed(2);
  
  // Update lamp states based on toggles (example logic)
  global.deviceState.lamps = [...global.deviceState.toggles];
  
  // Broadcast updated state
  io.emit('sensor_update', {
    gauges: global.deviceState.gauges,
    variables: global.deviceState.variables,
    lamps: global.deviceState.lamps,
    timestamp: new Date()
  });
}, 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});
