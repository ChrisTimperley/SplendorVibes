# Splendor Board Game

A web-based implementation of the popular board game Splendor, featuring a Node.js backend and modern web frontend.

## Project Structure

```
├── client/          # Frontend web application
├── server/          # Backend Node.js API
├── shared/          # Shared game logic and types
└── docs/           # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Start development servers:
```bash
npm run dev
```

This will start both the backend server (port 3001) and frontend development server (port 3000).

## Game Overview

Splendor is a card-based board game where players compete to collect gems and purchase development cards to build their economic engine. The first player to reach 15 prestige points wins.

### Core Game Elements
- **Gem Tokens**: 6 types (Diamond, Sapphire, Emerald, Ruby, Onyx, Gold)
- **Development Cards**: 3 tiers with varying costs and benefits
- **Noble Tiles**: Provide bonus points when requirements are met
- **Players**: 2-4 players supported

## Development

### Backend (Node.js + Express)
- RESTful API for game management
- WebSocket support for real-time gameplay
- Game state management
- Player authentication

### Frontend (React/Vue.js)
- Interactive game board
- Real-time updates
- Responsive design
- Game state visualization

### Shared Logic
- Game rules engine
- Card and token definitions
- Validation logic
- TypeScript type definitions

## Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run test` - Run all tests
- `npm start` - Start production server

## License

MIT
