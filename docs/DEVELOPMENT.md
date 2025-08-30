# Splendor Board Game - Development Guide

## Project Overview

This is a web-based implementation of the board game Splendor, built with:
- **Backend**: Node.js + Express + TypeScript + Socket.IO
- **Frontend**: React + TypeScript + Material-UI + Vite
- **Shared**: Common game logic and type definitions

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```
   This starts both backend (port 3001) and frontend (port 3000) concurrently.

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── services/      # API and socket services
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── sockets/       # WebSocket handlers
│   └── package.json
├── shared/                 # Shared code between client and server
│   ├── types/             # TypeScript type definitions
│   ├── game/              # Game logic and rules
│   └── data/              # Game data (cards, nobles)
└── package.json           # Root package.json for scripts
```

## Development Workflow

### Running Individual Services

**Backend only**:
```bash
cd server
npm run dev
```

**Frontend only**:
```bash
cd client
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run server tests
npm run server:test

# Run client tests
npm run client:test
```

### Building for Production

```bash
# Build everything
npm run build

# Build individual services
npm run server:build
npm run client:build
```

### Linting

```bash
# Lint server code
cd server && npm run lint

# Lint client code
cd client && npm run lint
```

## Game Implementation Status

### ✅ Completed
- Project structure and build system
- Basic TypeScript configuration
- Game type definitions
- Basic game engine structure
- REST API endpoints
- WebSocket setup
- React components structure

### 🚧 In Progress
- Game rules implementation
- UI/UX polish
- Error handling
- Input validation

### 📋 Todo
- Complete game logic
- Player authentication
- Game persistence
- Multiplayer lobby improvements
- Mobile responsive design
- Game replay system
- Spectator mode
- AI players

## API Endpoints

### Game Management
- `POST /api/games` - Create new game
- `GET /api/games/:gameId` - Get game state
- `POST /api/games/:gameId/join` - Join game
- `POST /api/games/:gameId/leave` - Leave game
- `GET /api/games` - List active games

### Game Actions
- `POST /api/games/:gameId/actions/take-tokens` - Take gems
- `POST /api/games/:gameId/actions/purchase-card` - Buy development card
- `POST /api/games/:gameId/actions/reserve-card` - Reserve development card

## WebSocket Events

### Client → Server
- `join-game` - Join game room
- `leave-game` - Leave game room
- `game-action` - Send game action

### Server → Client
- `game-state` - Updated game state
- `player-joined` - Player joined notification
- `player-left` - Player left notification
- `error` - Error message

## Game Rules Summary

Splendor is an engine-building game where players collect gems to purchase development cards. Each card provides a permanent gem bonus and prestige points. The first player to reach 15 prestige points wins.

### Actions (choose one per turn):
1. **Take Gems**: Take 3 different gems OR 2 of the same type (if 4+ available)
2. **Purchase Card**: Buy a development card using gems
3. **Reserve Card**: Set aside a card for later and gain a gold token

### Winning:
- First player to 15 prestige points
- Nobles visit when you meet their gem requirements
- Cards provide permanent gem bonuses

## Contributing

1. Create feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Kill process on port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Dependencies out of sync**:
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

**TypeScript errors**:
```bash
# Rebuild TypeScript
npm run build
```
