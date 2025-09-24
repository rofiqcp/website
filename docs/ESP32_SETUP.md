# Setup ESP32 untuk SCADA Control System

## Daftar Isi
1. [Hardware Requirements](#hardware-requirements)
2. [Software Requirements](#software-requirements)
3. [Wiring Diagram](#wiring-diagram)
4. [Arduino Code](#arduino-code)
5. [Configuration](#configuration)
6. [Testing](#testing)

## Hardware Requirements

### Komponen Utama
- **ESP32 Development Board** (ESP32-WROOM-32 atau sejenisnya)
- **LED** x4 (untuk indikator lampu)
- **Push Button** x4 (untuk input button)
- **Potentiometer** x4 (untuk simulasi slider input)
- **Resistor 220Ω** x4 (untuk LED)
- **Resistor 10kΩ** x4 (pull-up untuk button)
- **Breadboard** dan **Jumper Wires**

### Optional Components
- **Relay Module** x4 (untuk kontrol perangkat eksternal)
- **Sensor DHT22** (untuk temperature monitoring)
- **LCD Display 16x2** (untuk display lokal)

## Software Requirements

- **Arduino IDE** (versi 1.8.19 atau lebih baru)
- **ESP32 Board Package** untuk Arduino IDE
- **Libraries:**
  - WiFi (built-in)
  - WebServer (built-in)
  - ArduinoJson (install via Library Manager)
  - AsyncWebServer (optional, untuk performa lebih baik)

## Wiring Diagram

### Pin Mapping
```
ESP32 Pin | Function        | Component
----------|-----------------|------------------
GPIO 2    | LED 1          | LED + Resistor 220Ω
GPIO 4    | LED 2          | LED + Resistor 220Ω
GPIO 5    | LED 3          | LED + Resistor 220Ω
GPIO 18   | LED 4          | LED + Resistor 220Ω
GPIO 19   | Button 1       | Push Button + Pull-up 10kΩ
GPIO 21   | Button 2       | Push Button + Pull-up 10kΩ
GPIO 22   | Button 3       | Push Button + Pull-up 10kΩ
GPIO 23   | Button 4       | Push Button + Pull-up 10kΩ
GPIO 32   | Analog 1       | Potentiometer (Slider 1)
GPIO 33   | Analog 2       | Potentiometer (Slider 2)
GPIO 34   | Analog 3       | Potentiometer (Slider 3)
GPIO 35   | Analog 4       | Potentiometer (Slider 4)
3.3V      | Power          | VCC untuk komponen
GND       | Ground         | Ground untuk semua komponen
```

### Schematic Connection
```
LED Connection:
ESP32 GPIO -> 220Ω Resistor -> LED Anode -> LED Cathode -> GND

Button Connection:
ESP32 GPIO -> Push Button -> GND
ESP32 GPIO -> 10kΩ Resistor -> 3.3V (Pull-up)

Potentiometer Connection:
Pot Pin 1 -> 3.3V
Pot Pin 2 (Wiper) -> ESP32 Analog GPIO
Pot Pin 3 -> GND
```

## Arduino Code

Buat file baru di Arduino IDE dan copy code berikut:

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Pin Definitions
const int LED_PINS[] = {2, 4, 5, 18};
const int BUTTON_PINS[] = {19, 21, 22, 23};
const int ANALOG_PINS[] = {32, 33, 34, 35};

// Web Server
WebServer server(80);

// Device State
struct DeviceState {
  bool toggles[4] = {false, false, false, false};
  bool buttons[4] = {false, false, false, false};
  int sliders[4] = {0, 0, 0, 0};
  bool lamps[4] = {false, false, false, false};
  float gauges[2] = {0.0, 0.0};
  float variables[2] = {0.0, 0.0};
} deviceState;

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  initializePins();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Setup web server routes
  setupWebServer();
  
  // Start server
  server.begin();
  Serial.println("ESP32 SCADA Server started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  server.handleClient();
  
  // Read inputs
  readInputs();
  
  // Update outputs
  updateOutputs();
  
  // Update sensor data
  updateSensorData();
  
  delay(50); // Small delay for stability
}

void initializePins() {
  // Initialize LED pins
  for (int i = 0; i < 4; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
  }
  
  // Initialize button pins
  for (int i = 0; i < 4; i++) {
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
  }
  
  Serial.println("Pins initialized");
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void setupWebServer() {
  // Enable CORS
  server.onNotFound([]() {
    if (server.method() == HTTP_OPTIONS) {
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.sendHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
      server.send(200);
    } else {
      server.send(404, "text/plain", "Not found");
    }
  });
  
  // Ping endpoint
  server.on("/ping", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"status\":\"ok\",\"message\":\"ESP32 is alive\"}");
  });
  
  // Status endpoint
  server.on("/status", HTTP_GET, handleGetStatus);
  
  // Control endpoint
  server.on("/control", HTTP_POST, handlePostControl);
  
  Serial.println("Web server routes configured");
}

void handleGetStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  DynamicJsonDocument doc(1024);
  
  // Add device state to JSON
  JsonArray togglesArray = doc.createNestedArray("toggles");
  JsonArray buttonsArray = doc.createNestedArray("buttons");
  JsonArray slidersArray = doc.createNestedArray("sliders");
  JsonArray lampsArray = doc.createNestedArray("lamps");
  JsonArray gaugesArray = doc.createNestedArray("gauges");
  JsonArray variablesArray = doc.createNestedArray("variables");
  
  for (int i = 0; i < 4; i++) {
    togglesArray.add(deviceState.toggles[i]);
    buttonsArray.add(deviceState.buttons[i]);
    slidersArray.add(deviceState.sliders[i]);
    lampsArray.add(deviceState.lamps[i]);
  }
  
  for (int i = 0; i < 2; i++) {
    gaugesArray.add(deviceState.gauges[i]);
    variablesArray.add(deviceState.variables[i]);
  }
  
  doc["timestamp"] = millis();
  doc["wifi_rssi"] = WiFi.RSSI();
  doc["free_heap"] = ESP.getFreeHeap();
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handlePostControl() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  if (server.hasArg("plain")) {
    DynamicJsonDocument doc(512);
    deserializeJson(doc, server.arg("plain"));
    
    String type = doc["type"];
    JsonObject data = doc["data"];
    
    if (type == "toggle") {
      int id = data["id"];
      bool value = data["value"];
      if (id >= 0 && id < 4) {
        deviceState.toggles[id] = value;
        deviceState.lamps[id] = value; // Mirror toggle to lamp
        Serial.printf("Toggle %d set to %s\n", id + 1, value ? "ON" : "OFF");
      }
    }
    else if (type == "button") {
      int id = data["id"];
      if (id >= 0 && id < 4) {
        deviceState.buttons[id] = true;
        Serial.printf("Button %d pressed\n", id + 1);
        // Button will be reset in readInputs()
      }
    }
    else if (type == "slider") {
      int id = data["id"];
      int value = data["value"];
      if (id >= 0 && id < 4 && value >= 0 && value <= 100) {
        deviceState.sliders[id] = value;
        Serial.printf("Slider %d set to %d%%\n", id + 1, value);
      }
    }
    
    server.send(200, "application/json", "{\"success\":true,\"message\":\"Command executed\"}");
  } else {
    server.send(400, "application/json", "{\"success\":false,\"message\":\"No data received\"}");
  }
}

void readInputs() {
  // Read physical buttons
  for (int i = 0; i < 4; i++) {
    if (digitalRead(BUTTON_PINS[i]) == LOW) {
      if (!deviceState.buttons[i]) {
        deviceState.buttons[i] = true;
        Serial.printf("Physical button %d pressed\n", i + 1);
      }
    } else {
      deviceState.buttons[i] = false;
    }
  }
  
  // Read analog inputs (potentiometers)
  for (int i = 0; i < 4; i++) {
    int analogValue = analogRead(ANALOG_PINS[i]);
    deviceState.sliders[i] = map(analogValue, 0, 4095, 0, 100);
  }
}

void updateOutputs() {
  // Update LEDs based on lamp state
  for (int i = 0; i < 4; i++) {
    digitalWrite(LED_PINS[i], deviceState.lamps[i] ? HIGH : LOW);
  }
}

void updateSensorData() {
  // Simulate gauge data (replace with real sensors)
  deviceState.gauges[0] = random(0, 100); // Percentage
  deviceState.gauges[1] = random(0, 1000); // RPM
  
  // Simulate variable data
  deviceState.variables[0] = random(0, 1000); // Counter
  deviceState.variables[1] = random(200, 350) / 10.0; // Temperature (20.0 - 35.0°C)
}
```

## Configuration

### 1. WiFi Setup
Edit bagian WiFi configuration di code:
```cpp
const char* ssid = "YOUR_WIFI_SSID";        // Ganti dengan nama WiFi Anda
const char* password = "YOUR_WIFI_PASSWORD"; // Ganti dengan password WiFi Anda
```

### 2. Pin Configuration
Sesuaikan pin mapping jika diperlukan:
```cpp
const int LED_PINS[] = {2, 4, 5, 18};      // Pin untuk LED
const int BUTTON_PINS[] = {19, 21, 22, 23}; // Pin untuk Button
const int ANALOG_PINS[] = {32, 33, 34, 35}; // Pin untuk Analog Input
```

### 3. Web Application Setup
Di file `.env` web application, set IP ESP32:
```
ESP32_IP=192.168.1.100  # Ganti dengan IP ESP32 yang didapat
ESP32_PORT=80
ESP32_TIMEOUT=5000
```

## Testing

### 1. Upload Code ke ESP32
1. Buka Arduino IDE
2. Pilih Board: ESP32 Dev Module
3. Pilih Port yang sesuai
4. Upload code ke ESP32

### 2. Monitor Serial
1. Buka Serial Monitor (Ctrl+Shift+M)
2. Set baud rate ke 115200
3. Lihat IP address yang didapat ESP32

### 3. Test API Endpoints
Gunakan browser atau Postman untuk test:

**Get Status:**
```
GET http://192.168.1.100/status
```

**Ping Test:**
```
GET http://192.168.1.100/ping
```

**Control Command:**
```
POST http://192.168.1.100/control
Content-Type: application/json

{
  "type": "toggle",
  "data": {
    "id": 0,
    "value": true
  }
}
```

### 4. Test dengan Web Application
1. Jalankan web application: `npm run dev`
2. Buka Settings panel
3. Set IP ESP32 dan test koneksi
4. Coba kontrol dari dashboard

## Troubleshooting

### Common Issues:

**1. ESP32 tidak connect ke WiFi:**
- Pastikan SSID dan password benar
- Cek jarak ESP32 ke router
- Restart ESP32

**2. Web app tidak bisa connect ke ESP32:**
- Pastikan ESP32 dan PC di network yang sama
- Cek IP address ESP32 di Serial Monitor
- Test ping ke IP ESP32

**3. Kontrol tidak berfungsi:**
- Cek wiring connections
- Monitor Serial untuk error messages
- Pastikan pin mapping sesuai

**4. Sensor readings tidak akurat:**
- Cek koneksi analog pins
- Kalibrasi potentiometer
- Tambahkan delay jika perlu

## Advanced Features

### 1. Add Real Sensors
Replace simulated data dengan sensor asli:
```cpp
#include "DHT.h"
DHT dht(DHTPIN, DHT22);

void updateSensorData() {
  deviceState.variables[1] = dht.readTemperature();
  deviceState.gauges[0] = dht.readHumidity();
}
```

### 2. Add Relay Control
Untuk kontrol perangkat eksternal:
```cpp
const int RELAY_PINS[] = {25, 26, 27, 14};

void updateOutputs() {
  for (int i = 0; i < 4; i++) {
    digitalWrite(LED_PINS[i], deviceState.lamps[i] ? HIGH : LOW);
    digitalWrite(RELAY_PINS[i], deviceState.toggles[i] ? HIGH : LOW);
  }
}
```

### 3. Add EEPROM Storage
Untuk menyimpan state saat restart:
```cpp
#include <EEPROM.h>

void saveState() {
  EEPROM.begin(512);
  EEPROM.put(0, deviceState);
  EEPROM.commit();
}

void loadState() {
  EEPROM.begin(512);
  EEPROM.get(0, deviceState);
}
```
