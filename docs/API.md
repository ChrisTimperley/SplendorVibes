# Splendor Game API Documentation

## 📋 Overview

This document describes the REST API for the Splendor board game backend. The API handles game management, player actions, and game state operations.

## 🌐 Base URL

- **Development**: `http://localhost:3001`
- **API Base**: `http://localhost:3001/api`

## 🔄 Real-time Updates

The API works with Socket.IO for real-time game updates. All game state changes are broadcast to connected players via WebSocket events.

## 📚 API Reference

### System Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-30T18:55:41.118Z"
}
```

---

### Game Management

#### Create New Game
```http
POST /api/games
Content-Type: application/json

{
  "playerName": "Alice"
}
```

**Response (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "players": [{
    "id": "player-uuid",
    "name": "Alice",
    "tokens": { "diamond": 0, "sapphire": 0, ... },
    "cards": [],
    "reservedCards": [],
    "nobles": [],
    "prestige": 0
  }],
  "currentPlayerIndex": 0,
  "state": "waiting_for_players",
  "board": { ... },
  "createdAt": "2025-08-30T18:55:41.118Z",
  "updatedAt": "2025-08-30T18:55:41.118Z"
}
```

#### Get Game State
```http
GET /api/games/{gameId}
```

#### Join Game
```http
POST /api/games/{gameId}/join
Content-Type: application/json

{
  "playerName": "Bob"
}
```

#### Leave Game
```http
POST /api/games/{gameId}/leave
Content-Type: application/json

{
  "playerId": "player-uuid"
}
```

#### List All Games
```http
GET /api/games
```

---

### Game Actions

#### Take Tokens
Player takes gem tokens from the bank.

**Rules:**
- Take 3 different colored gems, OR
- Take 2 gems of the same color (if 4+ available)

```http
POST /api/games/{gameId}/actions/take-tokens
Content-Type: application/json

{
  "playerId": "player-uuid",
  "tokens": {
    "diamond": 1,
    "sapphire": 1,
    "emerald": 1
  }
}
```

#### Purchase Card
Player buys a development card using gems.

```http
POST /api/games/{gameId}/actions/purchase-card
Content-Type: application/json

{
  "playerId": "player-uuid",
  "cardId": "card_1_5",
  "payment": {
    "sapphire": 4
  }
}
```

#### Reserve Card
Player reserves a card for later purchase and gets a gold token.

```http
POST /api/games/{gameId}/actions/reserve-card
Content-Type: application/json

{
  "playerId": "player-uuid",
  "cardId": "card_2_3"
}
```

---

## 🎮 Game Flow Example

1. **Create Game:**
   ```bash
   curl -X POST http://localhost:3001/api/games \
     -H "Content-Type: application/json" \
     -d '{"playerName": "Alice"}'
   ```

2. **Join Game:**
   ```bash
   curl -X POST http://localhost:3001/api/games/{gameId}/join \
     -H "Content-Type: application/json" \
     -d '{"playerName": "Bob"}'
   ```

3. **Take Tokens:**
   ```bash
   curl -X POST http://localhost:3001/api/games/{gameId}/actions/take-tokens \
     -H "Content-Type: application/json" \
     -d '{
       "playerId": "player-uuid",
       "tokens": {"diamond": 1, "sapphire": 1, "emerald": 1}
     }'
   ```

## 🔗 WebSocket Events

### Client → Server
- `join-game`: Join game room for real-time updates
- `leave-game`: Leave game room
- `game-action`: Perform game action

### Server → Client
- `game-state`: Updated game state broadcast
- `player-joined`: Player joined notification
- `player-left`: Player left notification
- `error`: Error message

## 📊 Data Models

### Game State
```typescript
interface Game {
  id: string;                    // UUID
  players: Player[];             // 1-4 players
  currentPlayerIndex: number;    // Whose turn it is
  state: GameState;              // waiting_for_players | in_progress | finished
  board: GameBoard;              // Cards, tokens, nobles
  winner?: Player;               // Set when game ends
  createdAt: Date;
  updatedAt: Date;
}
```

### Player
```typescript
interface Player {
  id: string;                    // UUID
  name: string;                  // Display name
  tokens: TokenBank;             // Owned gem tokens
  cards: Card[];                 // Purchased development cards
  reservedCards: Card[];         // Reserved cards (max 3)
  nobles: Noble[];               // Noble tiles earned
  prestige: number;              // Total prestige points
}
```

### Token Bank
```typescript
interface TokenBank {
  diamond: number;               // White gems
  sapphire: number;              // Blue gems
  emerald: number;               // Green gems
  ruby: number;                  // Red gems
  onyx: number;                  // Black gems
  gold: number;                  // Gold wildcards
}
```

## ⚠️ Error Responses

All errors return the same format:
```json
{
  "error": "Error message description"
}
```

**Common Error Codes:**
- `400`: Bad Request (invalid action, not your turn, etc.)
- `404`: Not Found (game/player doesn't exist)
- `500`: Internal Server Error

## 🧪 Testing the API

Use the startup script to run the development server:
```bash
./start-dev.sh
```

Or run servers individually:
```bash
# Backend only
cd server && npm run dev

# Test health endpoint
curl http://localhost:3001/health
```

## 📖 Splendor Game Rules

- **Objective**: First player to 15 prestige points wins
- **Actions**: Each turn, choose one:
  1. Take gems (3 different OR 2 same if 4+ available)
  2. Purchase a development card
  3. Reserve a card (get gold token)
- **Cards**: Provide permanent gem bonuses and prestige points
- **Nobles**: Visit automatically when you meet their requirements
