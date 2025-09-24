import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsPanel.css';

const SettingsPanel = ({ deviceState }) => {
  const [esp32Config, setEsp32Config] = useState({
    ip: '192.168.1.100',
    port: '80',
    timeout: '5000'
  });
  const [systemInfo, setSystemInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadEsp32Config();
    loadSystemInfo();
  }, []);

  const loadEsp32Config = async () => {
    try {
      const response = await axios.get('/esp32/config');
      if (response.data.success) {
        setEsp32Config(response.data.config);
      }
    } catch (error) {
      console.error('Error loading ESP32 config:', error);
    }
  };

  const loadSystemInfo = async () => {
    try {
      const response = await axios.get('/api/info');
      if (response.data.success) {
        setSystemInfo(response.data.data);
      }
    } catch (error) {
      console.error('Error loading system info:', error);
    }
  };

  const handleConfigChange = (field, value) => {
    setEsp32Config(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveConfig = async () => {
    try {
      const response = await axios.post('/esp32/config', esp32Config);
      if (response.data.success) {
        addLog('Konfigurasi ESP32 berhasil disimpan');
      }
    } catch (error) {
      addLog('Error: Gagal menyimpan konfigurasi ESP32');
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    addLog('Testing koneksi ESP32...');
    
    try {
      const response = await axios.get('/esp32/test');
      if (response.data.success) {
        setConnectionStatus('connected');
        addLog('✅ Koneksi ESP32 berhasil');
      } else {
        setConnectionStatus('failed');
        addLog('❌ Koneksi ESP32 gagal');
      }
    } catch (error) {
      setConnectionStatus('failed');
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const resetSystem = async () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua kontrol?')) {
      try {
        const response = await axios.post('/api/reset');
        if (response.data.success) {
          addLog('✅ Sistem berhasil direset');
        }
      } catch (error) {
        addLog(`❌ Error reset: ${error.message}`);
      }
    }
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="settings-panel fade-in">
      <div className="grid grid-2">
        {/* ESP32 Configuration */}
        <div className="card">
          <h3 className="section-title">🔧 Konfigurasi ESP32</h3>
          <div className="config-form">
            <div className="form-group">
              <label>IP Address:</label>
              <input
                type="text"
                value={esp32Config.ip}
                onChange={(e) => handleConfigChange('ip', e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            <div className="form-group">
              <label>Port:</label>
              <input
                type="number"
                value={esp32Config.port}
                onChange={(e) => handleConfigChange('port', e.target.value)}
                placeholder="80"
              />
            </div>
            <div className="form-group">
              <label>Timeout (ms):</label>
              <input
                type="number"
                value={esp32Config.timeout}
                onChange={(e) => handleConfigChange('timeout', e.target.value)}
                placeholder="5000"
              />
            </div>
            <div className="button-group">
              <button className="btn btn-primary" onClick={saveConfig}>
                💾 Simpan Konfigurasi
              </button>
              <button 
                className={`btn btn-test ${connectionStatus}`} 
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
              >
                {connectionStatus === 'testing' ? '⏳ Testing...' : '🔍 Test Koneksi'}
              </button>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card">
          <h3 className="section-title">📊 Informasi Sistem</h3>
          {systemInfo && (
            <div className="system-info">
              <div className="info-item">
                <span className="info-label">Version:</span>
                <span className="info-value">{systemInfo.version}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Uptime:</span>
                <span className="info-value">{formatUptime(systemInfo.uptime)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Memory Usage:</span>
                <span className="info-value">
                  {Math.round(systemInfo.memory.heapUsed / 1024 / 1024)}MB
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">ESP32 Status:</span>
                <span className={`info-value status-${deviceState.esp32Connected ? 'connected' : 'disconnected'}`}>
                  {systemInfo.esp32Status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Update:</span>
                <span className="info-value">
                  {new Date(systemInfo.lastUpdate).toLocaleTimeString('id-ID')}
                </span>
              </div>
            </div>
          )}
          <div className="button-group">
            <button className="btn btn-warning" onClick={resetSystem}>
              🔄 Reset Sistem
            </button>
            <button className="btn btn-info" onClick={loadSystemInfo}>
              🔄 Refresh Info
            </button>
          </div>
        </div>

        {/* Device Status */}
        <div className="card">
          <h3 className="section-title">📱 Status Perangkat</h3>
          <div className="device-status">
            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">Toggles Active:</span>
                <span className="status-value">
                  {deviceState.toggles.filter(Boolean).length}/4
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Avg Slider Value:</span>
                <span className="status-value">
                  {Math.round(deviceState.sliders.reduce((a, b) => a + b, 0) / 4)}%
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Lamps ON:</span>
                <span className="status-value">
                  {deviceState.lamps.filter(Boolean).length}/4
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Gauge 1:</span>
                <span className="status-value">
                  {deviceState.gauges[0]?.toFixed(1) || '0.0'}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="card">
          <h3 className="section-title">📝 Log Aktivitas</h3>
          <div className="logs-container">
            {logs.length === 0 ? (
              <div className="no-logs">Belum ada aktivitas log</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))
            )}
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => setLogs([])}
            disabled={logs.length === 0}
          >
            🗑️ Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
