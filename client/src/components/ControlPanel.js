import React from 'react';
import ToggleButton from './controls/ToggleButton';
import PushButton from './controls/PushButton';
import SliderControl from './controls/SliderControl';
import './ControlPanel.css';

const ControlPanel = ({ deviceState, onToggleChange, onButtonPress, onSliderChange }) => {
  return (
    <div className="grid grid-3">
      {/* Toggle Controls */}
      <div className="card">
        <h3 className="section-title">🔘 Toggle Controls</h3>
        <div className="control-grid">
          {deviceState.toggles.map((value, index) => (
            <ToggleButton
              key={index}
              id={index}
              label={`Toggle ${index + 1}`}
              value={value}
              onChange={onToggleChange}
            />
          ))}
        </div>
      </div>

      {/* Push Buttons */}
      <div className="card">
        <h3 className="section-title">🔴 Push Buttons</h3>
        <div className="control-grid">
          {deviceState.buttons.map((value, index) => (
            <PushButton
              key={index}
              id={index}
              label={`Button ${index + 1}`}
              pressed={value}
              onPress={onButtonPress}
            />
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="card">
        <h3 className="section-title">🎚️ Slider Controls</h3>
        <div className="slider-container">
          {deviceState.sliders.map((value, index) => (
            <SliderControl
              key={index}
              id={index}
              label={`Slider ${index + 1}`}
              value={value}
              onChange={onSliderChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
