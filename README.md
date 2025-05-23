
# Media Hub Homebase - Self-Hosted Server Dashboard

A beautiful, responsive dashboard for managing your self-hosted media server with real-time system monitoring, customizable app shortcuts, and admin controls.

## Features

- 🖥️ Real-time system monitoring (CPU, RAM usage)
- 🎨 Customizable wallpapers (admin only)
- 🔗 Configurable app shortcuts with custom icons
- 👤 User authentication with admin privileges
- 📱 Responsive design for all devices
- 🔒 File-based authentication system

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

### 3. System Monitoring Setup (Real-time Stats)

The application uses browser APIs for basic monitoring. For enhanced server monitoring, you can set up additional endpoints:

#### Option A: Simple HTTP Endpoints (Recommended)

Create monitoring scripts that expose system stats via HTTP:

```bash
# Create monitoring directory
sudo mkdir -p /opt/media-hub-monitoring
cd /opt/media-hub-monitoring

# Create system stats script
sudo tee system-stats.py << 'EOF'
#!/usr/bin/env python3
import json
import psutil
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

class StatsHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/stats':
            stats = {
                'cpu': psutil.cpu_percent(interval=1),
                'memory': psutil.virtual_memory().percent,
                'disk': psutil.disk_usage('/').percent,
                'uptime': time.time() - psutil.boot_time(),
                'timestamp': time.time()
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(stats).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 3001), StatsHandler)
    print("System stats server running on http://localhost:3001/stats")
    server.serve_forever()
EOF

# Make executable
sudo chmod +x system-stats.py

# Install required Python packages
sudo pip3 install psutil

# Create systemd service
sudo tee /etc/systemd/system/media-hub-stats.service << 'EOF'
[Unit]
Description=Media Hub System Stats Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/media-hub-monitoring
ExecStart=/usr/bin/python3 /opt/media-hub-monitoring/system-stats.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable media-hub-stats.service
sudo systemctl start media-hub-stats.service

# Check service status
sudo systemctl status media-hub-stats.service
```

#### Option B: File-based Monitoring

```bash
# Create stats directory
sudo mkdir -p /var/www/media-hub/stats
sudo chown www-data:www-data /var/www/media-hub/stats

# Create stats update script
sudo tee /usr/local/bin/update-system-stats.sh << 'EOF'
#!/bin/bash

STATS_FILE="/var/www/media-hub/stats/system.json"

# Get system stats
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1)
UPTIME=$(uptime -p)
TIMESTAMP=$(date +%s)

# Create JSON
cat > "$STATS_FILE" << EOF
{
  "cpu": $CPU_USAGE,
  "memory": $MEMORY_USAGE,
  "disk": $DISK_USAGE,
  "uptime": "$UPTIME",
  "timestamp": $TIMESTAMP
}
EOF

chmod 644 "$STATS_FILE"
EOF

# Make executable
sudo chmod +x /usr/local/bin/update-system-stats.sh

# Add to crontab (updates every 5 seconds)
echo "* * * * * /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 5; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 10; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 15; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 20; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 25; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 30; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 35; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 40; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 45; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 50; /usr/local/bin/update-system-stats.sh" | sudo crontab -
echo "* * * * * sleep 55; /usr/local/bin/update-system-stats.sh" | sudo crontab -
```

### 4. Production Deployment with Nginx

```bash
# Build the application
npm run build

# Create web directory
sudo mkdir -p /var/www/media-hub
sudo cp -r dist/* /var/www/media-hub/
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

    # Proxy for system stats (if using Option A)
    location /api/stats {
        proxy_pass http://localhost:3001/stats;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
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

### 5. Power Management Setup

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

### 6. File Management Setup

For SFTP web interface, you can integrate existing solutions:

```bash
# Option 1: Use filebrowser (recommended)
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash

# Create filebrowser config
cat > filebrowser-config.json << 'EOF'
{
  "port": 8800,
  "baseURL": "",
  "address": "0.0.0.0",
  "log": "stdout",
  "database": "/etc/filebrowser.db",
  "root": "/home"
}
EOF

# Start filebrowser
sudo filebrowser -c filebrowser-config.json
```

### 7. Service Management

Create a comprehensive service manager:

```bash
# Create service control script
sudo tee /usr/local/bin/media-hub-services.sh << 'EOF'
#!/bin/bash

case "$1" in
    start)
        sudo systemctl start media-hub-stats
        sudo systemctl start nginx
        echo "Media Hub services started"
        ;;
    stop)
        sudo systemctl stop media-hub-stats
        sudo systemctl stop nginx
        echo "Media Hub services stopped"
        ;;
    restart)
        sudo systemctl restart media-hub-stats
        sudo systemctl restart nginx
        echo "Media Hub services restarted"
        ;;
    status)
        echo "=== Media Hub Service Status ==="
        sudo systemctl status media-hub-stats --no-pager
        sudo systemctl status nginx --no-pager
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
EOF

sudo chmod +x /usr/local/bin/media-hub-services.sh
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

### Changing Credentials

Edit the credentials file:

```bash
nano auth/credentials.json
```

### Custom Wallpapers

1. Login as admin
2. Click settings gear → Wallpaper tab
3. Upload image (max 5MB)
4. Wallpaper is permanently saved in browser storage

## Troubleshooting

### Common Issues

1. **System stats not updating**: Check if monitoring service is running
   ```bash
   sudo systemctl status media-hub-stats
   ```

2. **Authentication not working**: Verify credentials file permissions
   ```bash
   ls -la auth/credentials.json
   ```

3. **Wallpaper not persisting**: Clear browser storage and re-upload

4. **Apps not opening**: Check if target services are running on specified ports

### Logs

```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log

# System stats service logs
sudo journalctl -u media-hub-stats -f

# System logs
sudo tail -f /var/log/syslog
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
