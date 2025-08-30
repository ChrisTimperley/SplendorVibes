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
echo "   - API Documentation: http://localhost:3001/docs/index.html"
echo "   - Frontend: http://localhost:3000 (or next available port)"
echo ""
echo "Note: If ports 3000/3001 are in use, Vite will automatically find the next available port"
echo "Watch the terminal output below for the actual frontend URL"
echo "Press Ctrl+C to stop all servers"
echo "=================================================="

# Start both servers concurrently
npm run dev
