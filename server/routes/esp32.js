const express = require('express');
const axios = require('axios');
const router = express.Router();

// ESP32 configuration
const ESP32_CONFIG = {
  ip: process.env.ESP32_IP || '192.168.1.100',
  port: process.env.ESP32_PORT || 80,
  timeout: parseInt(process.env.ESP32_TIMEOUT) || 5000
};

// Test ESP32 connection
router.get('/test', async (req, res) => {
  try {
    const esp32Url = `http://${ESP32_CONFIG.ip}:${ESP32_CONFIG.port}`;
    const response = await axios.get(`${esp32Url}/ping`, {
      timeout: ESP32_CONFIG.timeout
    });
    
    global.deviceState.esp32Connected = true;
    
    res.json({
      success: true,
      message: 'ESP32 connection successful',
      data: {
        ip: ESP32_CONFIG.ip,
        port: ESP32_CONFIG.port,
        response: response.data
      }
    });
  } catch (error) {
    global.deviceState.esp32Connected = false;
    
    res.status(500).json({
      success: false,
      message: 'ESP32 connection failed',
      error: error.message,
      config: {
        ip: ESP32_CONFIG.ip,
        port: ESP32_CONFIG.port
      }
    });
  }
});

// Send command to ESP32
router.post('/command', async (req, res) => {
  try {
    const { type, data } = req.body;
    const esp32Url = `http://${ESP32_CONFIG.ip}:${ESP32_CONFIG.port}`;
    
    const response = await axios.post(`${esp32Url}/control`, {
      type,
      data
    }, {
      timeout: ESP32_CONFIG.timeout
    });
    
    global.deviceState.esp32Connected = true;
    
    res.json({
      success: true,
      message: 'Command sent to ESP32',
      data: response.data
    });
  } catch (error) {
    global.deviceState.esp32Connected = false;
    
    res.status(500).json({
      success: false,
      message: 'Failed to send command to ESP32',
      error: error.message
    });
  }
});

// Get ESP32 status
router.get('/status', async (req, res) => {
  try {
    const esp32Url = `http://${ESP32_CONFIG.ip}:${ESP32_CONFIG.port}`;
    const response = await axios.get(`${esp32Url}/status`, {
      timeout: ESP32_CONFIG.timeout
    });
    
    global.deviceState.esp32Connected = true;
    
    res.json({
      success: true,
      data: response.data,
      connection: 'Connected'
    });
  } catch (error) {
    global.deviceState.esp32Connected = false;
    
    res.status(500).json({
      success: false,
      message: 'Cannot get ESP32 status',
      error: error.message,
      connection: 'Disconnected'
    });
  }
});

// Update ESP32 configuration
router.post('/config', (req, res) => {
  const { ip, port, timeout } = req.body;
  
  if (ip) ESP32_CONFIG.ip = ip;
  if (port) ESP32_CONFIG.port = port;
  if (timeout) ESP32_CONFIG.timeout = timeout;
  
  res.json({
    success: true,
    message: 'ESP32 configuration updated',
    config: ESP32_CONFIG
  });
});

// Get ESP32 configuration
router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: ESP32_CONFIG
  });
});

module.exports = router;
