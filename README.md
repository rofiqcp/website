# SCADA ESP32 Control System

Website otomasi kendali SCADA untuk kontrol ESP32 dengan interface web yang modern dan responsif.

## Fitur

### Input Controls
- 4 Toggle Buttons untuk kontrol ON/OFF
- 4 Push Buttons untuk aksi sekali tekan
- 4 Sliders dengan range 0-100%

### Display Output
- 4 Indicator Lampu (ON/OFF status)
- 2 Gauge meters untuk monitoring nilai
- 2 Variable display boxes
- Real-time data monitoring

### Fitur Tambahan
- WebSocket real-time communication
- Settings panel untuk konfigurasi
- Responsive design
- Dark/Light theme
- Data logging
- ESP32 communication API

## Instalasi

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm atau yarn
- Git

### Setup Project

1. Clone repository:
```bash
git clone <repository-url>
cd scada-esp32-control
```

2. Install dependencies:
```bash
npm run install-all
```

3. Setup environment variables:
```bash
cp .env.example .env
```
Edit file `.env` sesuai konfigurasi Anda.

4. Jalankan development server:
```bash
npm run dev
```

Server akan berjalan di:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### GitHub Pages
```bash
npm run deploy
```

### Manual Build
```bash
npm run build
npm start
```

## Konfigurasi ESP32

### API Endpoints
- `GET /api/status` - Get current status
- `POST /api/toggle/:id` - Toggle button control
- `POST /api/button/:id` - Push button action
- `POST /api/slider/:id` - Set slider value
- `GET /api/sensors` - Get sensor data

### WebSocket Events
- `status_update` - Real-time status updates
- `sensor_data` - Sensor readings
- `control_change` - Control state changes

## Struktur Project

```
scada-esp32-control/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilities
│   │   └── styles/        # CSS styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── utils/             # Server utilities
│   └── index.js           # Server entry point
├── docs/                  # Documentation
├── .env.example           # Environment variables template
├── package.json           # Root package.json
└── README.md
```

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
"# website" 
"# website" 
