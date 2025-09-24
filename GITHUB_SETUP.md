# Setup GitHub Repository - Manual Steps

## 🚀 Push ke GitHub Repository: rofiqcp/website

### Prerequisites
1. Pastikan Anda sudah login ke GitHub
2. Repository `rofiqcp/website` sudah dibuat di GitHub
3. Git sudah terinstall di komputer Anda

### Step-by-Step Instructions

#### 1. Buka Command Prompt atau Git Bash
```bash
cd d:\PROGRAM\website
```

#### 2. Cek Status Git (sudah diinisialisasi)
```bash
git status
```

#### 3. Add Remote Repository
```bash
git remote add origin https://github.com/rofiqcp/website.git
```

#### 4. Verify Remote
```bash
git remote -v
```
Should show:
```
origin  https://github.com/rofiqcp/website.git (fetch)
origin  https://github.com/rofiqcp/website.git (push)
```

#### 5. Push to GitHub
```bash
git push -u origin main
```

### 🔐 Authentication Options

#### Option A: Personal Access Token (Recommended)
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with `repo` permissions
3. Use token as password when prompted

#### Option B: GitHub CLI
```bash
# Install GitHub CLI first
gh auth login
git push -u origin main
```

#### Option C: SSH Key (Advanced)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings > SSH and GPG keys
# Then use SSH URL
git remote set-url origin git@github.com:rofiqcp/website.git
git push -u origin main
```

### 📁 What's Being Uploaded

Your complete SCADA ESP32 Control System includes:

```
📦 SCADA ESP32 Control System
├── 🌐 Frontend (React)
│   ├── Modern UI with 4 toggles, 4 buttons, 4 sliders
│   ├── Real-time displays (4 lamps, 2 gauges, 2 variables)
│   └── Responsive design for mobile
├── 🔧 Backend (Node.js)
│   ├── RESTful API endpoints
│   ├── WebSocket real-time communication
│   └── ESP32 integration
├── 🔌 ESP32 Integration
│   ├── Complete Arduino code
│   ├── Hardware wiring diagrams
│   └── WiFi setup instructions
├── 🚀 Deployment Ready
│   ├── Docker containerization
│   ├── Netlify/Heroku configs
│   └── Automated scripts
└── 📚 Complete Documentation
    ├── Quick start guide
    ├── API documentation
    ├── Troubleshooting guide
    └── Deployment instructions
```

### 🌐 After Upload

Once uploaded, your repository will be available at:
**https://github.com/rofiqcp/website**

### 🚀 Next Steps - Deploy to Web

#### Option 1: Netlify (Recommended)
1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - Build command: `npm run install-all && npm run build`
   - Publish directory: `client/build`
4. Deploy!

#### Option 2: GitHub Pages
```bash
# Install gh-pages
npm install -g gh-pages

# Deploy
npm run build
npx gh-pages -d client/build
```

#### Option 3: Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
git push heroku main
```

### 🔧 Local Development
```bash
# Install dependencies
npm run install-all

# Start development server
npm run dev

# Access at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### 📱 Features Ready to Use
- ✅ 4 Toggle switches (ON/OFF control)
- ✅ 4 Push buttons (momentary actions)
- ✅ 4 Sliders (0-100% range)
- ✅ 4 Lamp indicators (visual status)
- ✅ 2 Gauge displays (circular meters)
- ✅ 2 Variable boxes (numeric display)
- ✅ Settings panel (ESP32 configuration)
- ✅ Real-time WebSocket updates
- ✅ Mobile responsive design
- ✅ Modern dark theme UI

### 🆘 Troubleshooting

#### If remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/rofiqcp/website.git
```

#### If authentication fails:
1. Use Personal Access Token instead of password
2. Or setup SSH key authentication
3. Or use GitHub CLI: `gh auth login`

#### If push is rejected:
```bash
# Force push (be careful!)
git push -u origin main --force
```

### 📞 Need Help?
- Check the complete documentation in `docs/` folder
- Review troubleshooting guide: `docs/TROUBLESHOOTING.md`
- Quick start guide: `docs/QUICK_START.md`

---

**🎉 Your SCADA ESP32 Control System is ready for the world!**
