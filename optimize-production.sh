#!/bin/bash

# Production Optimization Script cho NexChat

echo "🚀 Bắt đầu tối ưu hóa cho production..."

# 1. Tối ưu Client Build
echo "📦 Building optimized client..."
cd client
npm run build

# 2. Analyze bundle size
echo "📊 Phân tích bundle size..."
npx webpack-bundle-analyzer dist/static/js/*.js

# 3. Optimize images
echo "🖼️  Optimizing images..."
npx imagemin public/images/* --out-dir=public/images/optimized

# 4. Setup server optimizations
echo "⚙️  Configuring server optimizations..."
cd ../server

# Install production dependencies only
npm ci --production

# 5. Setup PM2 for production
echo "🔧 Setting up PM2..."
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'nexchat-server',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

echo "✅ Optimization completed!"
echo "📋 Next steps:"
echo "1. Set up environment variables in production"
echo "2. Create MongoDB indexes: node create-indexes.js"
echo "3. Start with: pm2 start ecosystem.config.js --env production"
echo "4. Monitor with: pm2 monit"