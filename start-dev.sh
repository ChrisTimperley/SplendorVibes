#!/bin/bash

echo "🎮 Starting Splendor Board Game Development Environment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if node_modules don't exist
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

echo "🚀 Starting development servers..."
echo "   - Backend API: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "=================================================="

# Start both servers concurrently
npm run dev
