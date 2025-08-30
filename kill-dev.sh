#!/bin/bash

echo "🔥 Killing development processes..."

# Kill Node.js development processes
echo "Stopping Node.js development processes..."
pkill -f "node.*vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true

# Kill processes on specific ports
echo "Freeing up ports 3000, 3001, 3002..."
for port in 3000 3001 3002; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "Killing process $pid on port $port"
        kill -9 $pid 2>/dev/null || sudo kill -9 $pid 2>/dev/null || true
    fi
done

# Double check with lsof and force kill if needed
remaining=$(lsof -ti:3000,3001,3002 2>/dev/null)
if [ ! -z "$remaining" ]; then
    echo "Force killing remaining processes..."
    echo $remaining | xargs -r kill -9 2>/dev/null || echo $remaining | xargs -r sudo kill -9 2>/dev/null || true
fi

echo "✅ Development processes stopped!"
echo "Ports 3000, 3001, 3002 are now available."
