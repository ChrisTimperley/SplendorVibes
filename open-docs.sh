#!/bin/bash

echo "🔧 Opening Splendor API Documentation..."

# Check if server is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Server is running"
    echo "📖 Opening API documentation in browser..."

    # Open the API documentation
    if command -v xdg-open > /dev/null; then
        xdg-open "http://localhost:3001/docs/index.html"
    elif command -v open > /dev/null; then
        open "http://localhost:3001/docs/index.html"
    else
        echo "🌐 Please open: http://localhost:3001/docs/index.html"
    fi

    echo ""
    echo "📚 Available endpoints:"
    echo "   - API Docs:     http://localhost:3001/docs/index.html"
    echo "   - OpenAPI Spec: http://localhost:3001/api-spec"
    echo "   - Health Check: http://localhost:3001/health"
    echo "   - Markdown Docs: http://localhost:3001/docs/API.md"
    echo ""
    echo "🧪 Quick tests:"
    echo "   curl http://localhost:3001/health"
    echo "   curl http://localhost:3001/api/games"
else
    echo "❌ Server is not running on port 3001"
    echo "🚀 Start the server first:"
    echo "   npm run dev"
    echo ""
    echo "📖 You can also view the static documentation:"
    echo "   - Markdown: docs/API.md"
    echo "   - OpenAPI:  docs/api-spec.yaml"
fi
