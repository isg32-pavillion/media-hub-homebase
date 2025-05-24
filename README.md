
# Media Hub Homebase - Self-Hosted Server Dashboard

A beautiful, responsive dashboard for managing your self-hosted media server with real-time system monitoring, customizable app shortcuts, and admin controls.

## Features

- 🖥️ Real-time system monitoring (CPU, RAM usage)
- 🔗 Configurable app shortcuts with custom icons
- 👤 User authentication with admin privileges
- 📱 Responsive design for all devices
- 🔒 File-based authentication system
- 📡 RSS feed management (admin only)

## Project URL

**Lovable Project**: https://lovable.dev/projects/15117789-401c-4320-bcc2-1c9d2b4a3c89

## Quick Setup

### Prerequisites

- Node.js & npm (install with [nvm](https://github.com/nvm-sh/nvm))
- Linux server with bash shell access
- Web server (nginx/apache) for production deployment

### 1. Clone and Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Authentication Setup

Create credentials file for authentication:

```bash
# Create auth directory in project root
mkdir -p auth

# Create initial credentials file
cat > auth/credentials.json << 'EOF'
{
  "users": [
    {
      "username": "admin",
      "password": "admin123",
      "role": "admin"
    },
    {
      "username": "user",
      "password": "user123", 
      "role": "user"
    }
  ]
}
EOF

# Set proper permissions
chmod 600 auth/credentials.json
```

### 3. Production Deployment with Nginx

```bash
# Build the application
npm run build

# Create web directory
sudo mkdir -p /var/www/media-hub
sudo cp -r dist/* /var/www/media-hub/

# Add wallpaper
sudo cp public/wallpaper.jpg /var/www/media-hub/
sudo chown -R www-data:www-data /var/www/media-hub

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/media-hub << 'EOF'
server {
    listen 80;
    server_name your-server-ip;  # Replace with your server IP
    root /var/www/media-hub;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Serve credentials file (restrict access)
    location /auth/ {
        internal;
        alias /var/www/media-hub/auth/;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/media-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Running as System Service on Startup

#### Option A: Systemd Service (Recommended for Production)

Create a systemd service to run the application on startup:

```bash
# Create service file
sudo tee /etc/systemd/system/media-hub.service << 'EOF'
[Unit]
Description=Media Hub Dashboard
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/media-hub
ExecStart=/usr/bin/nginx -g "daemon off;"
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable media-hub.service
sudo systemctl start media-hub.service

# Check service status
sudo systemctl status media-hub.service
```

#### Option B: Development Mode Service

For development or testing, create a service that runs the dev server:

```bash
# Create development service
sudo tee /etc/systemd/system/media-hub-dev.service << 'EOF'
[Unit]
Description=Media Hub Development Server
After=network.target

[Service]
Type=simple
User=yourusername
WorkingDirectory=/path/to/your/project
Environment=NODE_ENV=development
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Replace 'yourusername' and '/path/to/your/project' with actual values
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable media-hub-dev.service
sudo systemctl start media-hub-dev.service
```

#### Option C: PM2 Process Manager

Install PM2 for Node.js process management:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Navigate to your project directory
cd /path/to/your/project

# Build the project
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'media-hub',
    script: 'npm',
    args: 'run preview',
    cwd: '/path/to/your/project',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4173
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Follow the instructions provided by the command above
```

#### Option D: Docker Service

Create a Docker setup for containerized deployment:

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  media-hub:
    build: .
    ports:
      - "4173:4173"
    volumes:
      - ./auth:/app/auth
      - ./public/wallpaper.jpg:/app/dist/wallpaper.jpg
    restart: unless-stopped
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - media-hub
    restart: unless-stopped
EOF

# Build and start
docker-compose up -d

# Enable auto-start on boot
sudo systemctl enable docker
```

### 5. Service Management Commands

#### Systemd Services
```bash
# Start service
sudo systemctl start media-hub

# Stop service
sudo systemctl stop media-hub

# Restart service
sudo systemctl restart media-hub

# Check status
sudo systemctl status media-hub

# View logs
sudo journalctl -u media-hub -f

# Disable auto-start
sudo systemctl disable media-hub
```

#### PM2 Commands
```bash
# List running processes
pm2 list

# Restart application
pm2 restart media-hub

# Stop application
pm2 stop media-hub

# View logs
pm2 logs media-hub

# Monitor processes
pm2 monit
```

### 6. Power Management Setup

For shutdown functionality, create a secure shutdown script:

```bash
# Create shutdown script
sudo tee /usr/local/bin/media-hub-shutdown.sh << 'EOF'
#!/bin/bash
# Secure shutdown script for media hub

# Check if user has permission (you can customize this)
if [ "$USER" != "www-data" ] && [ "$USER" != "root" ]; then
    echo "Unauthorized"
    exit 1
fi

# Log the shutdown
logger "Media Hub: Shutdown initiated by $USER"

# Graceful shutdown
sudo shutdown -h now
EOF

sudo chmod +x /usr/local/bin/media-hub-shutdown.sh

# Add to sudoers for web user (if needed)
echo "www-data ALL=(ALL) NOPASSWD: /usr/local/bin/media-hub-shutdown.sh" | sudo tee -a /etc/sudoers
```

## Configuration

### Default Apps Configuration

The dashboard comes with these default apps:
- Jellyfin (192.168.31.96:8089)
- qBittorrent (192.168.31.96:8090) 
- SFTP WebUI (192.168.31.96:8800)
- SSH Terminal

### Customizing Apps

1. Login as admin
2. Click the settings gear icon
3. Go to "Apps" tab
4. Add/edit/remove applications

### RSS Feed Management

1. Login as admin
2. Hover over the RSS dock at the bottom
3. Use the + button to add new RSS feeds
4. Remove feeds with the X button

### Changing Credentials

Edit the credentials file:

```bash
nano auth/credentials.json
```

## Troubleshooting

### Common Issues

1. **Service not starting**: Check service logs
   ```bash
   sudo journalctl -u media-hub -f
   ```

2. **Authentication not working**: Verify credentials file permissions
   ```bash
   ls -la auth/credentials.json
   ```

3. **Apps not opening**: Check if target services are running on specified ports

4. **Port already in use**: Change the port in your configuration
   ```bash
   sudo netstat -tulpn | grep :80
   ```

### Logs

```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo tail -f /var/log/syslog

# Application logs (if using PM2)
pm2 logs media-hub
```

## Security Considerations

- Change default credentials immediately
- Use HTTPS in production (add SSL certificate)
- Restrict network access to trusted IPs
- Regularly update the system and dependencies
- Monitor access logs for suspicious activity

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- React + TypeScript
- Vite build tool
- Tailwind CSS for styling
- Shadcn/UI components
- Lucide React icons
- Local storage for persistence

## Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console for errors
- Check service logs on the server
- Ensure all dependencies are properly installed
