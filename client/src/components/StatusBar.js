import React from 'react';

const StatusBar = ({ connected, esp32Connected, lastUpdate, currentView, onViewChange }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID');
  };

  return (
    <div className="status-bar">
      <div className="status-indicators">
        <div className="status-indicator">
          <div className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></div>
          <span>Server: {connected ? 'Terhubung' : 'Terputus'}</span>
        </div>
        <div className="status-indicator">
          <div className={`status-dot ${esp32Connected ? 'connected' : 'disconnected'}`}></div>
          <span>ESP32: {esp32Connected ? 'Terhubung' : 'Terputus'}</span>
        </div>
      </div>
      
      <div className="navigation-tabs">
        <button 
          className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-tab ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => onViewChange('settings')}
        >
          ⚙️ Settings
        </button>
      </div>
      
      <div className="last-update">
        <span>Update: {formatTime(lastUpdate)}</span>
      </div>
    </div>
  );
};

export default StatusBar;
