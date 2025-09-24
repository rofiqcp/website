# Deployment Guide - SCADA ESP32 Control System

## Daftar Isi
1. [Local Development](#local-development)
2. [GitHub Setup](#github-setup)
3. [Netlify Deployment](#netlify-deployment)
4. [Heroku Deployment](#heroku-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Production Configuration](#production-configuration)

## Local Development

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm atau yarn
- Git

### Setup Steps

1. **Clone Repository**
```bash
git clone <your-repository-url>
cd scada-esp32-control
```

2. **Install Dependencies**
```bash
npm run install-all
```

3. **Environment Configuration**
```bash
cp .env.example .env
```

Edit file `.env`:
```env
PORT=5000
NODE_ENV=development
ESP32_IP=192.168.1.100
ESP32_PORT=80
ESP32_TIMEOUT=5000
CORS_ORIGIN=http://localhost:3000
```

4. **Run Development Server**
```bash
npm run dev
```

Server akan berjalan di:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## GitHub Setup

### 1. Create Repository
```bash
git init
git add .
git commit -m "Initial commit: SCADA ESP32 Control System"
git branch -M main
git remote add origin https://github.com/username/scada-esp32-control.git
git push -u origin main
```

### 2. Setup GitHub Actions (Optional)
Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm run install-all
    
    - name: Run tests
      run: npm test --if-present
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install and Build
      run: |
        npm run install-all
        npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './client/build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Netlify Deployment

### Method 1: GitHub Integration (Recommended)

1. **Login ke Netlify**
   - Kunjungi https://netlify.com
   - Login dengan GitHub account

2. **Connect Repository**
   - Klik "New site from Git"
   - Pilih GitHub dan authorize
   - Pilih repository scada-esp32-control

3. **Build Settings**
   ```
   Base directory: (leave empty)
   Build command: npm run install-all && npm run build
   Publish directory: client/build
   ```

4. **Environment Variables**
   Di Netlify dashboard, masuk ke Site settings > Environment variables:
   ```
   NODE_VERSION=18
   NPM_VERSION=9
   REACT_APP_SERVER_URL=https://your-backend-url.com
   ```

5. **Deploy**
   - Klik "Deploy site"
   - Netlify akan auto-deploy setiap push ke main branch

### Method 2: Manual Deploy

```bash
# Build project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=client/build
```

## Heroku Deployment

### 1. Setup Heroku

```bash
# Install Heroku CLI
# Download dari https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create scada-esp32-control

# Set buildpack
heroku buildpacks:set heroku/nodejs
```

### 2. Configuration

Buat file `Procfile`:
```
web: node server/index.js
```

Update `package.json`:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
}
```

### 3. Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set NPM_CONFIG_PRODUCTION=false
heroku config:set ESP32_IP=your.esp32.ip.address
heroku config:set ESP32_PORT=80
heroku config:set CORS_ORIGIN=https://your-app-name.herokuapp.com
```

### 4. Deploy

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production

COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install server dependencies
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci --only=production

# Copy server code
COPY server/ ./server/

# Copy built client
COPY --from=builder /app/client/build ./client/build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000

CMD ["node", "server/index.js"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  scada-app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - ESP32_IP=${ESP32_IP:-192.168.1.100}
      - ESP32_PORT=${ESP32_PORT:-80}
      - CORS_ORIGIN=http://localhost:5000
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - scada-app
    restart: unless-stopped
```

### 3. Build and Run

```bash
# Build image
docker build -t scada-esp32-control .

# Run container
docker run -p 5000:5000 \
  -e ESP32_IP=192.168.1.100 \
  -e NODE_ENV=production \
  scada-esp32-control

# Or use docker-compose
docker-compose up -d
```

## Production Configuration

### 1. Security Settings

**Environment Variables:**
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://yourdomain.com
SSL_ENABLED=true
```

**Server Security (server/index.js):**
```javascript
// Add security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 2. SSL/HTTPS Setup

**Nginx Configuration (nginx.conf):**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server scada-app:5000;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /socket.io/ {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 3. Monitoring & Logging

**Add PM2 for Process Management:**
```bash
npm install -g pm2

# Create ecosystem.config.js
module.exports = {
  apps: [{
    name: 'scada-esp32',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Database Integration (Optional)

**MongoDB Setup:**
```javascript
const mongoose = require('mongoose');

// Add to server/index.js
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scada', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create data logging schema
const DataLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  deviceState: Object,
  esp32Connected: Boolean
});

const DataLog = mongoose.model('DataLog', DataLogSchema);

// Log data every minute
setInterval(async () => {
  try {
    await DataLog.create({
      deviceState: global.deviceState,
      esp32Connected: global.deviceState.esp32Connected
    });
  } catch (error) {
    console.error('Error logging data:', error);
  }
}, 60000);
```

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **WebSocket Issues:**
   - Check CORS configuration
   - Verify proxy settings
   - Test with polling transport

3. **ESP32 Connection:**
   - Ensure ESP32 and server are on same network
   - Check firewall settings
   - Verify ESP32 IP address

4. **Performance Issues:**
   - Enable gzip compression
   - Implement caching
   - Use CDN for static assets

### Monitoring Commands:

```bash
# Check application logs
pm2 logs scada-esp32

# Monitor performance
pm2 monit

# Restart application
pm2 restart scada-esp32

# Check system resources
htop
df -h
```

## Backup & Recovery

### 1. Database Backup
```bash
# MongoDB backup
mongodump --db scada --out /backup/$(date +%Y%m%d)

# Restore
mongorestore --db scada /backup/20231224/scada
```

### 2. Configuration Backup
```bash
# Backup environment files
cp .env .env.backup.$(date +%Y%m%d)

# Backup nginx config
cp nginx.conf nginx.conf.backup.$(date +%Y%m%d)
```

### 3. Automated Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/$DATE"

mkdir -p $BACKUP_DIR

# Backup database
mongodump --db scada --out $BACKUP_DIR/

# Backup configuration
cp .env $BACKUP_DIR/
cp nginx.conf $BACKUP_DIR/

# Compress backup
tar -czf /backup/scada_backup_$DATE.tar.gz $BACKUP_DIR/

# Remove old backups (keep last 7 days)
find /backup -name "scada_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: scada_backup_$DATE.tar.gz"
```
