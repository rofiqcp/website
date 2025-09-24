import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Import components
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import ControlPanel from './components/ControlPanel';
import DisplayPanel from './components/DisplayPanel';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [socket, setSocket] = useState(null);
  const [deviceState, setDeviceState] = useState({
    toggles: [false, false, false, false],
    buttons: [false, false, false, false],
    sliders: [0, 0, 0, 0],
    lamps: [false, false, false, false],
    gauges: [0, 0],
    variables: [0, 0],
    lastUpdate: new Date(),
    esp32Connected: false
  });
  const [connected, setConnected] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });
    
    newSocket.on('device_state', (state) => {
      setDeviceState(state);
    });
    
    newSocket.on('sensor_update', (data) => {
      setDeviceState(prev => ({
        ...prev,
        gauges: data.gauges,
        variables: data.variables,
        lamps: data.lamps
      }));
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);

  const handleToggleChange = (id, value) => {
    if (socket) {
      socket.emit('toggle_change', { id, value });
    }
  };

  const handleButtonPress = (id) => {
    if (socket) {
      socket.emit('button_press', { id });
    }
  };

  const handleSliderChange = (id, value) => {
    if (socket) {
      socket.emit('slider_change', { id, value });
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'settings':
        return <SettingsPanel deviceState={deviceState} />;
      default:
        return (
          <>
            <ControlPanel
              deviceState={deviceState}
              onToggleChange={handleToggleChange}
              onButtonPress={handleButtonPress}
              onSliderChange={handleSliderChange}
            />
            <DisplayPanel deviceState={deviceState} />
          </>
        );
    }
  };

  return (
    <div className="App">
      <div className="container">
        <Header />
        <StatusBar 
          connected={connected}
          esp32Connected={deviceState.esp32Connected}
          lastUpdate={deviceState.lastUpdate}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;
