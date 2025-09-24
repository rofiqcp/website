const express = require('express');
const router = express.Router();

// Get current device state
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: global.deviceState,
    timestamp: new Date()
  });
});

// Toggle control
router.post('/toggle/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { value } = req.body;
  
  if (id >= 0 && id < 4 && typeof value === 'boolean') {
    global.deviceState.toggles[id] = value;
    global.deviceState.lastUpdate = new Date();
    
    res.json({
      success: true,
      message: `Toggle ${id + 1} set to ${value}`,
      data: { id, value }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid toggle ID or value'
    });
  }
});

// Button press
router.post('/button/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (id >= 0 && id < 4) {
    global.deviceState.buttons[id] = true;
    global.deviceState.lastUpdate = new Date();
    
    // Reset button after 100ms
    setTimeout(() => {
      global.deviceState.buttons[id] = false;
    }, 100);
    
    res.json({
      success: true,
      message: `Button ${id + 1} pressed`,
      data: { id }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid button ID'
    });
  }
});

// Slider control
router.post('/slider/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { value } = req.body;
  
  if (id >= 0 && id < 4 && typeof value === 'number' && value >= 0 && value <= 100) {
    global.deviceState.sliders[id] = value;
    global.deviceState.lastUpdate = new Date();
    
    res.json({
      success: true,
      message: `Slider ${id + 1} set to ${value}%`,
      data: { id, value }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid slider ID or value (must be 0-100)'
    });
  }
});

// Get sensor data
router.get('/sensors', (req, res) => {
  res.json({
    success: true,
    data: {
      gauges: global.deviceState.gauges,
      variables: global.deviceState.variables,
      lamps: global.deviceState.lamps,
      esp32Connected: global.deviceState.esp32Connected
    },
    timestamp: new Date()
  });
});

// System information
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      esp32Status: global.deviceState.esp32Connected ? 'Connected' : 'Disconnected',
      lastUpdate: global.deviceState.lastUpdate
    }
  });
});

// Reset all controls
router.post('/reset', (req, res) => {
  global.deviceState.toggles = [false, false, false, false];
  global.deviceState.buttons = [false, false, false, false];
  global.deviceState.sliders = [0, 0, 0, 0];
  global.deviceState.lastUpdate = new Date();
  
  res.json({
    success: true,
    message: 'All controls reset to default values'
  });
});

module.exports = router;
